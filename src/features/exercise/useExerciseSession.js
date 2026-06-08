import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { loadQuestionBank, loadQuestionCatalog, loadQuestionFiles } from '@/services/questionBankService'
import { readStorage, removeStorage, writeStorage } from '@/services/storageService'
import {
  normalizeHistoryLimit,
  readExerciseHistory,
  readExerciseSettings,
  removeExerciseHistory,
  clearExerciseProgress,
  upsertExerciseHistory,
  writeExerciseSettings,
} from '@/services/exerciseHistoryService'
import {
  buildQuestionExportRows,
  evaluateAnswer,
  filterQuestionExportRows,
  normalizeQuestionBank,
  shuffleQuestions,
} from '@/features/exercise/exerciseCore'
import {
  answerStatus as computeAnswerStatus,
  canAutoSubmit,
  matchesQuestionFilter,
  progressKey as buildProgressKey,
  responseHasValue,
  toggleMultipleOption,
} from '@/features/exercise/exerciseSession'
import { useAppStore } from '@/stores/appStore'

const PROGRESS_SAVE_DELAY = 400

export function useExerciseSession({ onSubmit } = {}) {
  const router = useRouter()
  const appStore = useAppStore()
  const savedSettings = readExerciseSettings()

  const catalog = ref([])
  const files = ref([])
  const selectedCoursePath = ref('')
  const selectedFilePath = ref('')
  const sourceKey = ref('')
  const bankTitle = ref('未选择题库')
  const questions = ref([])
  const activeIndex = ref(0)
  const responses = ref({})
  const submitted = ref({})
  const favorites = ref(new Set())
  const questionFilter = ref('all')
  const examSubmitted = ref(false)
  const loadError = ref('')
  const exportRange = ref('all')
  const exportFormat = ref('json')
  const history = ref(readExerciseHistory())
  const historyLimit = ref(savedSettings.historyLimit)
  const autoSubmitSingles = ref(savedSettings.autoSubmitSingles)
  const readingSize = ref(savedSettings.readingSize)
  const viewMode = ref('all')

  let progressSaveTimer = 0

  const activeQuestion = computed(() => questions.value[activeIndex.value])
  const resultsById = computed(() =>
    questions.value.reduce((results, question) => {
      results[question.id] = evaluateAnswer(question, responses.value[question.id])
      return results
    }, {}),
  )
  const visibleQuestions = computed(() =>
    questions.value.filter((question) =>
      matchesQuestionFilter(questionFilter.value, {
        answered: hasResponse(question),
        submitted: submitted.value[question.id],
        result: resultsById.value[question.id],
        favorite: favorites.value.has(question.id),
      }),
    ),
  )
  const displayedQuestions = computed(() => {
    if (viewMode.value === 'all') return visibleQuestions.value
    return activeQuestion.value ? [activeQuestion.value] : []
  })
  const answeredCount = computed(() => questions.value.filter((question) => hasResponse(question)).length)
  const submittedCount = computed(() => questions.value.filter((question) => submitted.value[question.id]).length)
  const correctCount = computed(
    () => questions.value.filter((question) => submitted.value[question.id] && resultsById.value[question.id]?.correct).length,
  )
  const wrongCount = computed(
    () =>
      questions.value.filter((question) => {
        if (!submitted.value[question.id]) return false
        const result = resultsById.value[question.id]
        return result.comparable && !result.correct
      }).length,
  )
  const wrongQuestions = computed(() =>
    questions.value.filter((question) => {
      const result = resultsById.value[question.id]
      return submitted.value[question.id] && result.comparable && !result.correct
    }),
  )
  const examSummary = computed(() => {
    const referenceCount = questions.value.filter(
      (question) => submitted.value[question.id] && !resultsById.value[question.id]?.comparable,
    ).length
    const scoreRate = questions.value.length ? Math.round((correctCount.value / questions.value.length) * 100) : 0
    return { referenceCount, scoreRate }
  })
  const typeSummary = computed(() => {
    const groups = new Map()
    questions.value.forEach((question) => {
      const label = question.typeLabel || question.type || '题目'
      const current = groups.get(label) || { label, total: 0, correct: 0 }
      current.total += 1
      if (submitted.value[question.id] && resultsById.value[question.id]?.correct) current.correct += 1
      groups.set(label, current)
    })
    return [...groups.values()]
  })
  const visibleIndexes = computed(() => visibleQuestions.value.map((question) => question.index))
  const currentVisiblePosition = computed(() => visibleIndexes.value.indexOf(activeIndex.value))
  const previousIndex = computed(() => visibleIndexes.value[currentVisiblePosition.value - 1])
  const nextIndex = computed(() => visibleIndexes.value[currentVisiblePosition.value + 1])
  const exportRows = computed(() => {
    const rows = buildQuestionExportRows(questions.value, {
      responses: responses.value,
      submitted: submitted.value,
      favorites: [...favorites.value],
    })
    return filterQuestionExportRows(rows, exportRange.value)
  })

  watch(questionFilter, () => {
    if (activeQuestion.value && visibleQuestions.value.some((question) => question.id === activeQuestion.value.id)) return
    activeIndex.value = visibleQuestions.value[0]?.index ?? 0
  })

  watch([historyLimit, autoSubmitSingles, viewMode, readingSize], () => {
    historyLimit.value = normalizeHistoryLimit(historyLimit.value)
    writeExerciseSettings({
      historyLimit: historyLimit.value,
      autoSubmitSingles: autoSubmitSingles.value,
      viewMode: viewMode.value,
      readingSize: readingSize.value,
    })
  })

  function hasResponse(question) {
    return responseHasValue(responses.value[question.id])
  }

  function questionResult(question) {
    return resultsById.value[question.id] || evaluateAnswer(question, responses.value[question.id])
  }

  function answerStatus(question) {
    return computeAnswerStatus({
      submitted: submitted.value[question.id],
      result: questionResult(question),
      answered: hasResponse(question),
    })
  }

  function progressKey() {
    return buildProgressKey(sourceKey.value, bankTitle.value)
  }

  async function loadCatalog() {
    try {
      catalog.value = await loadQuestionCatalog()
    } catch (reason) {
      loadError.value = reason instanceof Error ? reason.message : '题库目录加载失败'
    }
  }

  async function loadFilesForSelectedCourse() {
    files.value = []
    selectedFilePath.value = ''
    loadError.value = ''
    if (!selectedCoursePath.value) return
    try {
      files.value = await loadQuestionFiles(selectedCoursePath.value)
    } catch (reason) {
      loadError.value = reason instanceof Error ? reason.message : '题库文件读取失败'
    }
  }

  async function loadSelectedFile() {
    if (!selectedFilePath.value) return
    const file = files.value.find((item) => item.path === selectedFilePath.value)
    await loadFromPath(selectedFilePath.value, file?.name || selectedFilePath.value)
  }

  async function loadFromPath(path, title, options = {}) {
    loadError.value = ''
    try {
      const raw = await loadQuestionBank(path)
      applyQuestionBank(raw, title, path, options)
      appStore.rememberQuestionBank(path)
    } catch (reason) {
      loadError.value = reason instanceof Error ? reason.message : '题库加载失败'
    }
  }

  function applyQuestionBank(raw, title, source, options = {}) {
    const normalized = normalizeQuestionBank(raw, source || title)
    questions.value = normalized.map((question, index) => ({ ...question, index }))
    bankTitle.value = title || '本地题库'
    sourceKey.value = source || `local:${title || 'bank'}`
    activeIndex.value = 0
    responses.value = {}
    submitted.value = {}
    favorites.value = new Set()
    questionFilter.value = 'all'
    examSubmitted.value = false
    if (options.reset) removeStorage(progressKey())
    else restoreProgress()
    saveProgress()
  }

  function restoreProgress() {
    const saved = readStorage(progressKey(), null)
    if (!saved) return
    responses.value = saved.responses || {}
    submitted.value = saved.submitted || {}
    favorites.value = new Set(saved.favorites || [])
    activeIndex.value = Math.min(saved.activeIndex || 0, Math.max(questions.value.length - 1, 0))
    examSubmitted.value = Boolean(saved.examSubmitted)
  }

  function saveProgress() {
    clearScheduledProgressSave()
    writeProgressNow()
  }

  function scheduleProgressSave() {
    if (!questions.value.length) return
    window.clearTimeout(progressSaveTimer)
    progressSaveTimer = window.setTimeout(() => {
      progressSaveTimer = 0
      writeProgressNow()
    }, PROGRESS_SAVE_DELAY)
  }

  function flushProgressSave() {
    if (!progressSaveTimer) return
    window.clearTimeout(progressSaveTimer)
    progressSaveTimer = 0
    writeProgressNow()
  }

  function clearScheduledProgressSave() {
    window.clearTimeout(progressSaveTimer)
    progressSaveTimer = 0
  }

  function writeProgressNow() {
    if (!questions.value.length) return
    const key = progressKey()
    writeStorage(key, {
      title: bankTitle.value,
      responses: responses.value,
      submitted: submitted.value,
      favorites: [...favorites.value],
      activeIndex: activeIndex.value,
      examSubmitted: examSubmitted.value,
      updatedAt: Date.now(),
    })
    history.value = upsertExerciseHistory(
      {
        id: key,
        progressKey: key,
        sourceKey: sourceKey.value,
        title: bankTitle.value,
        path: sourceKey.value.startsWith('local:') ? '' : selectedFilePath.value || sourceKey.value,
        total: questions.value.length,
        answered: answeredCount.value,
        submitted: submittedCount.value,
        correct: correctCount.value,
        wrong: wrongCount.value,
        favorite: favorites.value.size,
        activeIndex: activeIndex.value,
        updatedAt: Date.now(),
      },
      historyLimit.value,
    )
  }

  function emitSubmit(question) {
    if (!question || typeof onSubmit !== 'function') return
    onSubmit(question, responses.value[question.id], resultsById.value[question.id])
  }

  function setOption(question, optionIndex, checked) {
    const next = { ...responses.value }
    if (question.type === 'multiple') {
      next[question.id] = toggleMultipleOption(next[question.id], optionIndex, checked)
    } else {
      next[question.id] = optionIndex
    }
    responses.value = next
    if (canAutoSubmit(question, autoSubmitSingles.value)) {
      submitted.value = { ...submitted.value, [question.id]: true }
      saveProgress()
      emitSubmit(question)
      return
    }
    saveProgress()
  }

  function setTextAnswer(question, value) {
    responses.value = { ...responses.value, [question.id]: value }
    scheduleProgressSave()
  }

  function isSelected(question, optionIndex) {
    const value = responses.value[question.id]
    return Array.isArray(value) ? value.includes(optionIndex) : value === optionIndex
  }

  function submitQuestion(question) {
    if (!question) return
    submitted.value = { ...submitted.value, [question.id]: true }
    saveProgress()
    emitSubmit(question)
  }

  function submitExam() {
    if (!questions.value.length) return
    const next = { ...submitted.value }
    const freshlySubmitted = []
    questions.value.forEach((question) => {
      if (!next[question.id]) freshlySubmitted.push(question)
      next[question.id] = true
    })
    submitted.value = next
    examSubmitted.value = true
    saveProgress()
    freshlySubmitted.forEach(emitSubmit)
  }

  function showWrongQuestions() {
    questionFilter.value = 'wrong'
    viewMode.value = 'all'
    activeIndex.value = visibleQuestions.value[0]?.index ?? 0
    saveProgress()
  }

  function redoWrongQuestions() {
    if (!wrongQuestions.value.length) return
    const originalTitle = bankTitle.value
    const originalSource = sourceKey.value || originalTitle || 'bank'
    const stamp = `${Date.now()}`
    questions.value = wrongQuestions.value.map((question, index) => ({ ...question, index }))
    bankTitle.value = `${originalTitle} - 错题重做`
    sourceKey.value = `wrong:${originalSource}:${stamp}`
    selectedCoursePath.value = ''
    selectedFilePath.value = ''
    activeIndex.value = 0
    responses.value = {}
    submitted.value = {}
    favorites.value = new Set()
    questionFilter.value = 'all'
    examSubmitted.value = false
    saveProgress()
  }

  function toggleFavorite(id) {
    const next = new Set(favorites.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    favorites.value = next
    saveProgress()
  }

  function isFavorite(id) {
    return favorites.value.has(id)
  }

  function setQuestionFilter(filter) {
    questionFilter.value = filter
  }

  function goToQuestion(question) {
    goToIndex(question.index, viewMode.value === 'all')
  }

  function goToIndex(index, shouldScroll = false) {
    if (index == null || index < 0) return
    activeIndex.value = index
    saveProgress()
    if (!shouldScroll) return
    requestAnimationFrame(() => {
      const question = questions.value.find((item) => item.index === index)
      if (question) document.getElementById(`question-${question.index + 1}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    })
  }

  function shuffleCurrent() {
    questions.value = shuffleQuestions(questions.value).map((question, index) => ({ ...question, index }))
    activeIndex.value = 0
    removeStorage(progressKey())
    responses.value = {}
    submitted.value = {}
    favorites.value = new Set()
    questionFilter.value = 'all'
    examSubmitted.value = false
    saveProgress()
  }

  function restartCurrent() {
    if (!questions.value.length) return
    removeStorage(progressKey())
    responses.value = {}
    submitted.value = {}
    favorites.value = new Set()
    activeIndex.value = 0
    questionFilter.value = 'all'
    examSubmitted.value = false
    saveProgress()
  }

  async function resumeHistory(entry, reset = false) {
    if (!entry.reloadable || !entry.path) {
      loadError.value = '本地导入的题库不会写入 localStorage；请重新导入原 JSON 后继续。'
      return
    }
    selectedFilePath.value = entry.path
    await router.replace({
      path: '/practice/exercise',
      query: { src: entry.path, title: entry.title, ...(reset ? { restart: '1' } : {}) },
    })
    await loadFromPath(entry.path, entry.title, { reset })
  }

  function removeHistory(entry) {
    if (entry.progressKey) clearExerciseProgress(entry.progressKey)
    history.value = removeExerciseHistory(entry.id)
  }

  function importLocalBank(raw, fileName) {
    selectedFilePath.value = ''
    applyQuestionBank(raw, fileName, `local:${fileName}`)
  }

  onBeforeUnmount(() => {
    flushProgressSave()
  })

  return {
    // state
    catalog,
    files,
    selectedCoursePath,
    selectedFilePath,
    sourceKey,
    bankTitle,
    questions,
    activeIndex,
    responses,
    submitted,
    favorites,
    questionFilter,
    examSubmitted,
    loadError,
    exportRange,
    exportFormat,
    history,
    historyLimit,
    autoSubmitSingles,
    readingSize,
    viewMode,
    // computeds
    activeQuestion,
    resultsById,
    visibleQuestions,
    displayedQuestions,
    answeredCount,
    submittedCount,
    correctCount,
    wrongCount,
    wrongQuestions,
    examSummary,
    typeSummary,
    previousIndex,
    nextIndex,
    exportRows,
    // helpers
    hasResponse,
    questionResult,
    answerStatus,
    isSelected,
    isFavorite,
    progressKey,
    // actions
    loadCatalog,
    loadFilesForSelectedCourse,
    loadSelectedFile,
    loadFromPath,
    applyQuestionBank,
    importLocalBank,
    setOption,
    setTextAnswer,
    submitQuestion,
    submitExam,
    showWrongQuestions,
    redoWrongQuestions,
    toggleFavorite,
    setQuestionFilter,
    goToQuestion,
    goToIndex,
    shuffleCurrent,
    restartCurrent,
    resumeHistory,
    removeHistory,
    flushProgressSave,
  }
}
