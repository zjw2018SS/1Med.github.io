<template>
  <section class="page-wrap exercise-page" :class="`font-${readingSize}`">
    <div class="page-title">
      <div>
        <h1>练习台</h1>
        <p>{{ bankTitle }}</p>
      </div>
      <div class="exercise-actions">
        <button class="button" type="button" @click="fileInput?.click()">
          <FileUp :size="18" />
          导入 JSON
        </button>
        <input ref="fileInput" class="hidden-input" type="file" accept=".json,application/json" @change="handleFileImport" />
        <button class="button" type="button" :disabled="questions.length === 0" @click="restartCurrent">
          <RotateCcw :size="18" />
          重新做
        </button>
        <button class="button" type="button" :disabled="questions.length === 0" @click="shuffleCurrent">
          <Shuffle :size="18" />
          乱序
        </button>
        <button class="button primary" type="button" :disabled="questions.length === 0" @click="submitExam">
          <ListChecks :size="18" />
          交卷
        </button>
        <button class="button primary" type="button" :disabled="questions.length === 0 || exportRows.length === 0" @click="exportCurrent">
          <Download :size="18" />
          导出
        </button>
      </div>
    </div>

    <div class="exercise-loader card">
      <label class="field">
        <Search :size="17" />
        <select v-model="selectedCoursePath" @change="loadFilesForSelectedCourse">
          <option value="">选择题库目录</option>
          <option v-for="item in catalog" :key="item.id" :value="item.path">{{ item.name }}</option>
        </select>
      </label>
      <label class="field">
        <FileQuestion :size="17" />
        <select v-model="selectedFilePath" @change="loadSelectedFile">
          <option value="">选择题库文件</option>
          <option v-for="item in files" :key="item.id" :value="item.path">{{ item.name }}</option>
        </select>
      </label>
      <label class="field export-field">
        <ListFilter :size="17" />
        <select v-model="exportRange">
          <option value="all">导出全部</option>
          <option value="submitted">导出已提交</option>
          <option value="wrong">导出错题</option>
          <option value="favorites">导出收藏</option>
        </select>
      </label>
      <div class="segmented-control" aria-label="做题视图">
        <button type="button" :class="{ active: viewMode === 'single' }" @click="viewMode = 'single'">单题</button>
        <button type="button" :class="{ active: viewMode === 'all' }" @click="viewMode = 'all'">全部</button>
      </div>
      <label class="field reading-size-field">
        <Type :size="17" />
        <select v-model="readingSize">
          <option value="small">小字号</option>
          <option value="medium">中字号</option>
          <option value="large">大字号</option>
        </select>
      </label>
      <label class="toggle-row compact-toggle">
        <input v-model="autoSubmitSingles" type="checkbox" />
        单选/判断自动提交
      </label>
      <label class="field history-limit">
        <Settings2 :size="17" />
        <select v-model.number="historyLimit">
          <option :value="6">保留 6 条历史</option>
          <option :value="12">保留 12 条历史</option>
          <option :value="20">保留 20 条历史</option>
          <option :value="30">保留 30 条历史</option>
        </select>
      </label>
      <label class="field export-field">
        <FileDown :size="17" />
        <select v-model="exportFormat">
          <option value="json">JSON</option>
          <option value="txt">TXT</option>
          <option value="csv">CSV</option>
        </select>
      </label>
      <span v-if="questions.length" class="status">可导出 {{ exportRows.length }} 题</span>
      <span v-if="loadError" class="inline-error">{{ loadError }}</span>
    </div>

    <details v-if="history.length" class="history-panel card">
      <summary class="history-summary">
        <span>
          <History :size="18" />
          <strong>历史记录</strong>
          <small>{{ history.length }} 条，展开后可继续、重做或删除</small>
        </span>
        <span class="status">最多 {{ historyLimit }} 条</span>
      </summary>
      <div class="history-list">
        <div v-for="entry in history" :key="entry.id" class="history-row">
          <div>
            <strong>{{ entry.title }}</strong>
            <span>{{ entry.answered }}/{{ entry.total }} 已答 · {{ entry.submitted }} 已交 · {{ entry.wrong }} 错 · {{ new Date(entry.updatedAt).toLocaleString() }}</span>
          </div>
          <div class="history-actions">
            <button class="button" type="button" :disabled="!entry.reloadable" @click="resumeHistory(entry)">继续</button>
            <button class="button" type="button" :disabled="!entry.reloadable" @click="resumeHistory(entry, true)">重做</button>
            <button class="icon-button" type="button" title="删除记录" @click="removeHistory(entry)">
              <XCircle :size="17" />
            </button>
          </div>
        </div>
      </div>
    </details>

    <section v-if="questions.length && examSubmitted" class="exam-summary card">
      <div class="exam-summary__main">
        <div>
          <strong>{{ examSummary.scoreRate }}%</strong>
          <span>正确率</span>
        </div>
        <div>
          <strong>{{ correctCount }}/{{ questions.length }}</strong>
          <span>正确题数</span>
        </div>
        <div>
          <strong>{{ wrongCount }}</strong>
          <span>错题</span>
        </div>
        <div>
          <strong>{{ examSummary.referenceCount }}</strong>
          <span>参考题</span>
        </div>
      </div>
      <div class="exam-summary__types">
        <span v-for="item in typeSummary" :key="item.label">
          {{ item.label }}：{{ item.correct }}/{{ item.total }}
        </span>
      </div>
      <div class="exam-summary__actions">
        <button class="button" type="button" :disabled="wrongCount === 0" @click="showWrongQuestions">
          <ListFilter :size="18" />
          只看错题
        </button>
        <button class="button danger" type="button" :disabled="wrongCount === 0" @click="redoWrongQuestions">
          <RotateCcw :size="18" />
          重做错题
        </button>
      </div>
    </section>

    <div v-if="questions.length === 0" class="empty">
      请选择题库文件或导入本地 JSON。
    </div>

    <button v-if="questions.length" class="button index-drawer-toggle" type="button" @click="indexDrawerOpen = true">
      <ListFilter :size="18" />
      题号
    </button>
    <div v-if="questions.length && indexDrawerOpen" class="index-drawer-backdrop" @click="indexDrawerOpen = false"></div>

    <div v-if="questions.length" class="exercise-layout" :class="{ 'all-mode': viewMode === 'all' }">
      <aside class="question-index card" :class="{ 'is-open': indexDrawerOpen }">
        <div class="question-index__top">
          <strong>题号</strong>
          <button class="icon-button" type="button" title="关闭题号抽屉" @click="indexDrawerOpen = false">
            <XCircle :size="18" />
          </button>
        </div>
        <div class="metrics">
          <div class="metric">
            <strong>{{ questions.length }}</strong>
            <span>题目</span>
          </div>
          <div class="metric">
            <strong>{{ answeredCount }}</strong>
            <span>已答</span>
          </div>
          <div class="metric">
            <strong>{{ submittedCount }}</strong>
            <span>已交</span>
          </div>
          <div class="metric">
            <strong>{{ correctCount }}</strong>
            <span>正确</span>
          </div>
        </div>
        <label v-if="false" class="toggle-row">
          <input v-model="onlyFavorites" type="checkbox" />
          只看收藏
        </label>
        <div class="index-filter" aria-label="题号筛选">
          <button
            v-for="filter in questionFilters"
            :key="filter.key"
            type="button"
            :class="{ active: questionFilter === filter.key }"
            @click="setQuestionFilter(filter.key)"
          >
            {{ filter.label }}
          </button>
        </div>
        <div class="question-buttons">
          <button
            v-for="question in visibleQuestions"
            :key="question.id"
            type="button"
            :class="indexClass(question)"
            :title="`第 ${question.index + 1} 题：${answerStatus(question).label}`"
            @click="goToQuestion(question)"
          >
            <span>{{ question.index + 1 }}</span>
            <small>{{ answerStatus(question).short }}</small>
          </button>
        </div>
      </aside>

      <div class="question-stack">
      <article v-for="question in displayedQuestions" :id="questionAnchorId(question)" :key="question.id" class="question-card card" :class="{ active: activeIndex === question.index }">
        <div class="question-card__top">
          <span class="status">{{ question.typeLabel }} · {{ answerStatus(question).label }}</span>
          <button class="icon-button" type="button" :title="isFavorite(question.id) ? '取消收藏' : '收藏'" @click="toggleFavorite(question.id)">
            <Star v-if="isFavorite(question.id)" :size="18" fill="currentColor" />
            <StarOff v-else :size="18" />
          </button>
        </div>

        <h2>{{ question.index + 1 }}. {{ question.title }}</h2>

        <div v-if="question.options.length" class="options">
          <label
            v-for="(option, optionIndex) in question.options"
            :key="`${question.id}-${optionIndex}`"
            class="option-row"
            :class="{ selected: isSelected(question, optionIndex) }"
          >
            <input
              :type="question.type === 'multiple' ? 'checkbox' : 'radio'"
              :name="question.id"
              :checked="isSelected(question, optionIndex)"
              @change="setOption(question, optionIndex, $event.target.checked)"
            />
            <span class="option-letter">{{ optionLetter(optionIndex) }}</span>
            <span>{{ option }}</span>
          </label>
        </div>

        <textarea
          v-else
          class="answer-textarea"
          :value="responses[question.id] || ''"
          placeholder="输入你的答案"
          @input="setTextAnswer(question, $event.target.value)"
        />

        <div class="question-toolbar">
          <button v-if="viewMode === 'single'" class="button" type="button" :disabled="!previousIndex && previousIndex !== 0" @click="goToIndex(previousIndex)">
            <ChevronLeft :size="18" />
            上一题
          </button>
          <button class="button primary" type="button" @click="submitQuestion(question)">
            <CheckCircle2 :size="18" />
            提交
          </button>
          <button v-if="viewMode === 'single'" class="button" type="button" :disabled="!nextIndex && nextIndex !== 0" @click="goToIndex(nextIndex)">
            下一题
            <ChevronRight :size="18" />
          </button>
        </div>

        <div v-if="submitted[question.id]" class="answer-panel" :class="{ correct: questionResult(question).correct, wrong: !questionResult(question).correct && questionResult(question).comparable }">
          <div class="answer-panel__status">
            <CheckCircle2 v-if="questionResult(question).correct" :size="19" />
            <XCircle v-else-if="questionResult(question).comparable" :size="19" />
            <ListChecks v-else :size="19" />
            <strong>{{ resultLabelFor(question) }}</strong>
          </div>
          <p><span>你的答案：</span>{{ responseToText(question, responses[question.id]) || '未作答' }}</p>
          <p><span>参考答案：</span>{{ referenceAnswer(question) }}</p>
          <p v-if="question.analysis"><span>解析：</span>{{ question.analysis }}</p>
        </div>
      </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileDown,
  FileQuestion,
  FileUp,
  History,
  ListFilter,
  ListChecks,
  RotateCcw,
  Search,
  Settings2,
  Shuffle,
  Star,
  StarOff,
  Type,
  XCircle,
} from '@lucide/vue'
import { loadQuestionBank, loadQuestionCatalog, loadQuestionFiles } from '@/services/questionBankService'
import { readStorage, removeStorage, writeStorage } from '@/services/storageService'
import {
  clearExerciseProgress,
  normalizeHistoryLimit,
  readExerciseHistory,
  readExerciseSettings,
  removeExerciseHistory,
  upsertExerciseHistory,
  writeExerciseSettings,
} from '@/services/exerciseHistoryService'
import {
  buildQuestionExportRows,
  evaluateAnswer,
  filterQuestionExportRows,
  formatExportContent,
  normalizeQuestionBank,
  responseToText,
  shuffleQuestions,
} from '@/features/exercise/exerciseCore'
import { useAppStore } from '@/stores/appStore'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const savedSettings = readExerciseSettings()

const fileInput = ref(null)
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
const onlyFavorites = ref(false)
const questionFilter = ref('all')
const examSubmitted = ref(false)
const indexDrawerOpen = ref(false)
const loadError = ref('')
const exportRange = ref('all')
const exportFormat = ref('json')
const history = ref(readExerciseHistory())
const historyLimit = ref(savedSettings.historyLimit)
const autoSubmitSingles = ref(savedSettings.autoSubmitSingles)
const readingSize = ref(savedSettings.readingSize)
const viewMode = ref('all')
const toolPreviewStorageKey = '1med:tool-preview-bank'
const extensionAckMessage = '1Med is OK!'
const progressSaveDelay = 400
const questionFilters = [
  { key: 'all', label: '全部' },
  { key: 'unanswered', label: '未答' },
  { key: 'answered', label: '已答' },
  { key: 'wrong', label: '错题' },
  { key: 'favorites', label: '收藏' },
]
let extensionReceiverCleanup = null
let progressSaveTimer = 0

const activeQuestion = computed(() => questions.value[activeIndex.value])
const visibleQuestions = computed(() => {
  return questions.value.filter((question) => {
    return matchesQuestionFilter(question)
  })
})
const displayedQuestions = computed(() => {
  if (viewMode.value === 'all') return visibleQuestions.value
  return activeQuestion.value ? [activeQuestion.value] : []
})
const answeredCount = computed(() => questions.value.filter((question) => hasResponse(question)).length)
const submittedCount = computed(() => questions.value.filter((question) => submitted.value[question.id]).length)
const resultsById = computed(() => {
  return questions.value.reduce((results, question) => {
    results[question.id] = evaluateAnswer(question, responses.value[question.id])
    return results
  }, {})
})
const correctCount = computed(() => {
  return questions.value.filter((question) => submitted.value[question.id] && resultsById.value[question.id]?.correct).length
})
const wrongCount = computed(() => {
  return questions.value.filter((question) => {
    if (!submitted.value[question.id]) return false
    const result = resultsById.value[question.id]
    return result.comparable && !result.correct
  }).length
})
const wrongQuestions = computed(() => {
  return questions.value.filter((question) => {
    const result = resultsById.value[question.id]
    return submitted.value[question.id] && result.comparable && !result.correct
  })
})
const examSummary = computed(() => {
  const referenceCount = questions.value.filter((question) => submitted.value[question.id] && !resultsById.value[question.id]?.comparable).length
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
  sourceKey.value = source || `local:${title || Date.now()}`
  activeIndex.value = 0
  responses.value = {}
  submitted.value = {}
  favorites.value = new Set()
  onlyFavorites.value = false
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
  }, progressSaveDelay)
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

function progressKey() {
  return `exercise:${sourceKey.value || bankTitle.value}`
}

function setOption(question, optionIndex, checked) {
  const next = { ...responses.value }
  if (question.type === 'multiple') {
    const current = Array.isArray(next[question.id]) ? [...next[question.id]] : []
    if (checked && !current.includes(optionIndex)) current.push(optionIndex)
    if (!checked) current.splice(current.indexOf(optionIndex), 1)
    next[question.id] = current.sort((a, b) => a - b)
  } else {
    next[question.id] = optionIndex
  }
  responses.value = next
  if (canAutoSubmit(question)) {
    submitted.value = { ...submitted.value, [question.id]: true }
  }
  saveProgress()
}

function handleExerciseKeydown(event) {
  if (viewMode.value !== 'single' || !questions.value.length || isTypingTarget(event.target)) return
  const question = activeQuestion.value
  if (!question) return

  if (event.key === 'ArrowLeft') {
    if (previousIndex.value == null) return
    event.preventDefault()
    goToIndex(previousIndex.value)
    return
  }

  if (event.key === 'ArrowRight') {
    if (nextIndex.value == null) return
    event.preventDefault()
    goToIndex(nextIndex.value)
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    submitQuestion(question)
    if (nextIndex.value != null) goToIndex(nextIndex.value)
    return
  }

  if (event.key.toLowerCase() === 'f') {
    event.preventDefault()
    toggleFavorite(question.id)
    return
  }

  const optionIndex = optionIndexFromShortcut(event.key)
  if (optionIndex == null || !question.options[optionIndex]) return
  event.preventDefault()
  setOption(question, optionIndex, question.type === 'multiple' ? !isSelected(question, optionIndex) : true)
}

function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) return false
  const tagName = target.tagName.toLowerCase()
  return target.isContentEditable || ['input', 'textarea', 'select'].includes(tagName)
}

function optionIndexFromShortcut(key) {
  if (/^[1-8]$/.test(key)) return Number(key) - 1
  const code = key.toUpperCase().charCodeAt(0)
  if (code >= 65 && code <= 72) return code - 65
  return null
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
}

function submitExam() {
  if (!questions.value.length) return
  const next = { ...submitted.value }
  questions.value.forEach((question) => {
    next[question.id] = true
  })
  submitted.value = next
  examSubmitted.value = true
  saveProgress()
}

function showWrongQuestions() {
  questionFilter.value = 'wrong'
  onlyFavorites.value = false
  viewMode.value = 'all'
  activeIndex.value = visibleQuestions.value[0]?.index ?? 0
  saveProgress()
}

function redoWrongQuestions() {
  if (!wrongQuestions.value.length) return
  const originalTitle = bankTitle.value
  const originalSource = sourceKey.value || originalTitle || Date.now()
  questions.value = wrongQuestions.value.map((question, index) => ({ ...question, index }))
  bankTitle.value = `${originalTitle} - 错题重做`
  sourceKey.value = `wrong:${originalSource}:${Date.now()}`
  selectedCoursePath.value = ''
  selectedFilePath.value = ''
  activeIndex.value = 0
  responses.value = {}
  submitted.value = {}
  favorites.value = new Set()
  onlyFavorites.value = false
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

function indexClass(question) {
  const status = answerStatus(question)
  return {
    active: activeIndex.value === question.index,
    answered: status.key === 'answered',
    done: status.key === 'submitted' || status.key === 'reference',
    correct: status.key === 'correct',
    wrong: status.key === 'wrong',
    reference: status.key === 'reference',
    favorite: favorites.value.has(question.id),
  }
}

function hasResponse(question) {
  const value = responses.value[question.id]
  if (Array.isArray(value)) return value.length > 0
  return value != null && String(value).trim() !== ''
}

function matchesQuestionFilter(question) {
  if (questionFilter.value === 'unanswered') return !hasResponse(question)
  if (questionFilter.value === 'answered') return hasResponse(question)
  if (questionFilter.value === 'wrong') {
    const result = resultsById.value[question.id]
    return submitted.value[question.id] && result.comparable && !result.correct
  }
  if (questionFilter.value === 'favorites') return favorites.value.has(question.id)
  return true
}

function setQuestionFilter(filter) {
  if (!questionFilters.some((item) => item.key === filter)) return
  questionFilter.value = filter
}

function questionResult(question) {
  return resultsById.value[question.id] || evaluateAnswer(question, responses.value[question.id])
}

function resultLabelFor(question) {
  const result = questionResult(question)
  if (result.correct) return '回答正确'
  if (result.comparable) return '回答错误'
  return '参考答案'
}

function answerStatus(question) {
  const result = questionResult(question)
  if (submitted.value[question.id] && result.correct) return { key: 'correct', label: '正确', short: '对' }
  if (submitted.value[question.id] && result.comparable) return { key: 'wrong', label: '错误', short: '错' }
  if (submitted.value[question.id]) return { key: 'reference', label: '已提交', short: '交' }
  if (hasResponse(question)) return { key: 'answered', label: '已作答', short: '答' }
  return { key: 'unanswered', label: '未作答', short: '未' }
}

function canAutoSubmit(question) {
  return autoSubmitSingles.value && ['single', 'judge'].includes(question.type) && question.answerIndexes.length === 1
}

function questionAnchorId(question) {
  return `question-${question.index + 1}`
}

function goToQuestion(question) {
  goToIndex(question.index, viewMode.value === 'all')
  indexDrawerOpen.value = false
}

function goToIndex(index, shouldScroll = false) {
  if (index == null || index < 0) return
  activeIndex.value = index
  saveProgress()
  if (!shouldScroll) return
  requestAnimationFrame(() => {
    const question = questions.value.find((item) => item.index === index)
    if (question) document.getElementById(questionAnchorId(question))?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  })
}

function optionLetter(index) {
  return String.fromCharCode(65 + index)
}

function referenceAnswer(question) {
  if (question.answerIndexes.length && question.options.length) {
    return question.answerIndexes.map((index) => `${optionLetter(index)}. ${question.options[index] || ''}`).join('；')
  }
  return question.answerText || '暂无参考答案'
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
  if (entry.progressKey) {
    clearExerciseProgress(entry.progressKey)
  }
  history.value = removeExerciseHistory(entry.id)
}

function exportCurrent() {
  if (!questions.value.length || exportRows.value.length === 0) return

  const content = formatExportContent(
    exportRows.value,
    {
      title: bankTitle.value,
      range: exportRange.value,
      exportedAt: Date.now(),
    },
    exportFormat.value,
  )
  const mimeMap = {
    json: 'application/json;charset=utf-8',
    txt: 'text/plain;charset=utf-8',
    csv: 'text/csv;charset=utf-8',
  }
  const prefix = exportRangeLabel(exportRange.value)
  const downloadContent = exportFormat.value === 'csv' ? `\ufeff${content}` : content
  downloadTextFile(downloadContent, `${safeFileName(bankTitle.value)}-${prefix}.${exportFormat.value}`, mimeMap[exportFormat.value])
}

function exportRangeLabel(range) {
  const map = {
    all: '全部',
    submitted: '已提交',
    wrong: '错题',
    favorites: '收藏',
  }
  return map[range] || '导出'
}

function downloadTextFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType || 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function safeFileName(value) {
  return String(value || '题库导出')
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
}

function handleFileImport(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const raw = JSON.parse(String(reader.result || '[]'))
      selectedFilePath.value = ''
      applyQuestionBank(raw, file.name, `local:${file.name}`)
    } catch {
      loadError.value = '导入失败：JSON 格式不正确'
    }
  }
  reader.readAsText(file)
  event.target.value = ''
}

function hasExtensionQuery() {
  return Object.prototype.hasOwnProperty.call(route.query, 'extension')
}

function parseExtensionPayload(data) {
  if (typeof data === 'string') {
    const text = data.trim()
    if (!text || !/^[{[]/.test(text)) return null
    return JSON.parse(text)
  }
  if (Array.isArray(data) || Array.isArray(data?.body)) return data
  return null
}

function startExtensionReceiver() {
  extensionReceiverCleanup?.()
  bankTitle.value = '等待 chaoxingRedo 发送题库...'
  loadError.value = ''

  const timeoutId = window.setTimeout(() => {
    if (!questions.value.length) {
      loadError.value = '等待 chaoxingRedo 题库数据超时，请回到学习通页面重新点击重做。'
    }
    cleanup()
  }, 15000)

  function cleanup() {
    window.clearTimeout(timeoutId)
    window.removeEventListener('message', handleExtensionMessage)
    extensionReceiverCleanup = null
  }

  function handleExtensionMessage(event) {
    let raw
    try {
      raw = parseExtensionPayload(event.data)
    } catch {
      return
    }
    if (!raw) return

    const title = raw?.head?.filename || raw?.head?.title || String(route.query.title || 'chaoxingRedo 题库')
    selectedFilePath.value = ''
    selectedCoursePath.value = ''
    applyQuestionBank(raw, title, 'extension:chaoxingRedo')

    const targetOrigin = event.origin && event.origin !== 'null' ? event.origin : '*'
    event.source?.postMessage(extensionAckMessage, targetOrigin)
    window.opener?.postMessage(extensionAckMessage, '*')
    cleanup()
  }

  window.addEventListener('message', handleExtensionMessage)
  extensionReceiverCleanup = cleanup
}

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleExerciseKeydown)
  flushProgressSave()
  extensionReceiverCleanup?.()
})

onMounted(async () => {
  window.addEventListener('keydown', handleExerciseKeydown)

  try {
    catalog.value = await loadQuestionCatalog()
  } catch (reason) {
    loadError.value = reason instanceof Error ? reason.message : '题库目录加载失败'
  }

  const shouldReset = route.query.restart === '1'
  if (route.query.src) {
    selectedFilePath.value = String(route.query.src)
    await loadFromPath(selectedFilePath.value, String(route.query.title || route.query.src), { reset: shouldReset })
  } else if (route.query.toolPreview === '1') {
    const previewText = localStorage.getItem(toolPreviewStorageKey)
    localStorage.removeItem(toolPreviewStorageKey)
    if (!previewText) {
      loadError.value = '工具预览数据不存在，请回到 JSON 题库生成工具重新预览。'
      return
    }
    try {
      const raw = JSON.parse(previewText)
      selectedFilePath.value = ''
      applyQuestionBank(raw, String(route.query.title || '工具预览题库'), 'tool-preview')
    } catch {
      loadError.value = '工具预览失败：JSON 格式不正确'
    }
  } else if (hasExtensionQuery()) {
    startExtensionReceiver()
  } else if (appStore.lastQuestionBank) {
    selectedFilePath.value = appStore.lastQuestionBank
    const lastHistory = history.value.find((item) => item.path === appStore.lastQuestionBank)
    await loadFromPath(appStore.lastQuestionBank, lastHistory?.title || appStore.lastQuestionBank)
  }
})
</script>

<style scoped>
.exercise-page {
  width: min(1320px, calc(100% - 32px));
  --exercise-body-size: 16px;
  --exercise-title-size: 24px;
}

.exercise-page.font-small {
  --exercise-body-size: 15px;
  --exercise-title-size: 22px;
}

.exercise-page.font-large {
  --exercise-body-size: 18px;
  --exercise-title-size: 28px;
}

.exercise-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hidden-input {
  display: none;
}

.exercise-loader {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 12px;
  margin-bottom: 16px;
}

.exercise-loader .field {
  flex: 1 1 260px;
}

.exercise-loader .export-field {
  flex: 0 1 170px;
}

.exercise-loader .history-limit {
  flex: 0 1 180px;
}

.exercise-loader .reading-size-field {
  flex: 0 1 150px;
}

.segmented-control {
  display: inline-flex;
  height: 40px;
  padding: 3px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--control-bg);
}

.segmented-control button {
  min-width: 56px;
  border: 0;
  border-radius: 5px;
  color: var(--muted);
  background: transparent;
}

.segmented-control button.active {
  color: var(--brand-contrast);
  background: var(--brand);
}

.compact-toggle {
  min-height: 40px;
  margin: 0;
  padding: 0 10px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--control-bg);
}

.inline-error {
  color: var(--rose);
}

.history-panel {
  margin-bottom: 16px;
  padding: 0;
  overflow: hidden;
}

.history-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  min-height: 54px;
  padding: 0 16px;
  cursor: pointer;
  list-style: none;
}

.history-summary::-webkit-details-marker {
  display: none;
}

.history-summary > span:first-child {
  display: flex;
  align-items: center;
  gap: 8px;
}

.history-summary strong {
  font-size: 16px;
}

.history-summary small {
  color: var(--muted);
  font-size: 13px;
}

.history-list {
  display: grid;
  gap: 8px;
  max-height: 260px;
  overflow: auto;
  padding: 0 16px 16px;
}

.history-row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--surface-muted);
}

.history-row strong,
.history-row span {
  display: block;
}

.history-row span {
  margin-top: 4px;
  color: var(--muted);
  font-size: 13px;
}

.history-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.exam-summary {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px 18px;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
}

.exam-summary__main {
  display: grid;
  grid-template-columns: repeat(4, minmax(92px, 1fr));
  gap: 10px;
}

.exam-summary__main div {
  padding: 10px 12px;
  border-radius: 7px;
  background: var(--surface-muted);
}

.exam-summary__main strong,
.exam-summary__main span,
.exam-summary__types span {
  display: block;
}

.exam-summary__main strong {
  font-size: 24px;
  line-height: 1.1;
}

.exam-summary__main span,
.exam-summary__types {
  color: var(--muted);
  font-size: 13px;
}

.exam-summary__types {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
}

.exam-summary__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.exercise-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 16px;
}

.exercise-layout.all-mode {
  grid-template-columns: 230px 1fr;
}

.question-index {
  align-self: start;
  position: sticky;
  top: 86px;
  max-height: calc(100vh - 104px);
  overflow: auto;
  padding: 12px;
}

.index-drawer-toggle,
.index-drawer-backdrop,
.question-index__top {
  display: none;
}

.metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.metrics .metric {
  padding: 12px;
  background: var(--surface-muted);
  border-radius: 7px;
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
  color: var(--muted);
}

.index-filter {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6px;
  margin: 12px 0;
}

.index-filter button {
  min-height: 34px;
  padding: 0 6px;
  border: 1px solid var(--line);
  border-radius: 7px;
  color: var(--text-soft);
  background: var(--control-bg);
  font-size: 13px;
}

.index-filter button.active {
  border-color: var(--brand);
  color: var(--brand-contrast);
  background: var(--brand);
}

.question-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
  gap: 7px;
}

.question-buttons button {
  display: grid;
  place-items: center;
  gap: 1px;
  min-height: 44px;
  border: 1px solid var(--line);
  border-radius: 7px;
  color: var(--text);
  background: var(--surface);
}

.question-buttons small {
  color: var(--muted);
  font-size: 11px;
  line-height: 1;
}

.question-buttons button.active {
  border-color: var(--brand);
  color: var(--brand-contrast);
  background: var(--brand);
}

.question-buttons button.active small {
  color: color-mix(in srgb, var(--brand-contrast) 78%, transparent);
}

.question-buttons button.answered {
  border-color: rgba(47, 111, 189, 0.4);
  background: color-mix(in srgb, var(--blue) 10%, var(--surface));
}

.question-buttons button.done {
  border-color: rgba(47, 111, 189, 0.35);
}

.question-buttons button.correct {
  border-color: rgba(36, 122, 99, 0.38);
  background: color-mix(in srgb, var(--brand) 13%, var(--surface));
}

.question-buttons button.wrong {
  border-color: rgba(189, 74, 90, 0.38);
  background: color-mix(in srgb, var(--rose) 12%, var(--surface));
}

.question-buttons button.reference {
  background: var(--surface-muted);
}

.question-buttons button.favorite {
  box-shadow: inset 0 -3px 0 var(--amber);
}

.question-stack {
  display: grid;
  gap: 16px;
}

.question-card {
  scroll-margin-top: 86px;
  padding: 24px;
  font-size: var(--exercise-body-size);
}

.question-card.active {
  border-color: color-mix(in srgb, var(--brand) 42%, var(--line));
}

.question-card__top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.question-card h2 {
  margin: 0 0 22px;
  font-size: var(--exercise-title-size);
  line-height: 1.45;
}

.options {
  display: grid;
  gap: 10px;
}

.option-row {
  display: grid;
  grid-template-columns: 20px 32px 1fr;
  align-items: start;
  gap: 10px;
  min-height: 48px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--surface);
  line-height: 1.6;
}

.option-row.selected {
  border-color: rgba(36, 122, 99, 0.45);
  background: var(--surface-soft);
}

.option-letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  color: var(--brand-strong);
  background: var(--surface-soft);
  font-weight: 800;
}

.answer-textarea {
  width: 100%;
  min-height: 150px;
  padding: 13px;
  border: 1px solid var(--line);
  border-radius: 7px;
  color: var(--text);
  background: var(--surface);
  resize: vertical;
}

.question-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.answer-panel {
  margin-top: 18px;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--surface-muted);
}

.answer-panel.correct {
  border-color: rgba(36, 122, 99, 0.32);
  background: color-mix(in srgb, var(--brand) 10%, var(--surface));
}

.answer-panel.wrong {
  border-color: rgba(189, 74, 90, 0.28);
  background: color-mix(in srgb, var(--rose) 10%, var(--surface));
}

.answer-panel__status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.answer-panel p {
  margin: 8px 0 0;
  line-height: 1.65;
}

.answer-panel span {
  color: var(--muted);
}

@media (max-width: 960px) {
  .exercise-layout {
    grid-template-columns: 1fr;
  }

  .index-drawer-toggle {
    display: inline-flex;
    margin-bottom: 12px;
  }

  .index-drawer-backdrop {
    position: fixed;
    inset: 0;
    z-index: 38;
    display: block;
    background: rgba(0, 0, 0, 0.35);
  }

  .question-index {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 39;
    max-height: min(72vh, 620px);
    padding: 14px;
    overflow: auto;
    border-radius: 14px 14px 0 0;
    box-shadow: var(--shadow);
    transform: translateY(calc(100% + 18px));
    transition: transform 180ms ease;
  }

  .question-index.is-open {
    transform: translateY(0);
  }

  .question-index__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
  }

  .history-row {
    grid-template-columns: 1fr;
  }

  .history-actions {
    justify-content: flex-start;
  }

  .exam-summary {
    grid-template-columns: 1fr;
  }

  .exam-summary__main {
    grid-template-columns: 1fr 1fr;
  }

  .exam-summary__actions {
    justify-content: flex-start;
  }
}
</style>
