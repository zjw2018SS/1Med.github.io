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
        <button class="button" type="button" :disabled="!questions.length" @click="restartCurrent">
          <RotateCcw :size="18" />
          重新做
        </button>
        <button class="button" type="button" :disabled="!questions.length" @click="shuffleCurrent">
          <Shuffle :size="18" />
          乱序
        </button>
        <button class="button primary" type="button" :disabled="!questions.length" @click="submitExam">
          <ListChecks :size="18" />
          交卷
        </button>
        <button class="button primary" type="button" :disabled="!questions.length || exportRows.length === 0" @click="exportCurrent">
          <Download :size="18" />
          导出
        </button>
      </div>
    </div>

    <ProgressBar
      v-if="questions.length"
      :answered="answeredCount"
      :total="questions.length"
      :submitted="submittedCount"
      :correct="correctCount"
      :wrong="wrongCount"
    />

    <ExerciseToolbar
      v-model:course-path="selectedCoursePath"
      v-model:file-path="selectedFilePath"
      v-model:view-mode="viewMode"
      v-model:reading-size="readingSize"
      v-model:export-range="exportRange"
      v-model:export-format="exportFormat"
      v-model:history-limit="historyLimit"
      v-model:auto-submit-singles="autoSubmitSingles"
      :catalog="catalog"
      :files="files"
      :questions-length="questions.length"
      :export-rows-length="exportRows.length"
      :load-error="loadError"
      @change-course="loadFilesForSelectedCourse"
      @change-file="loadSelectedFile"
    />

    <HistoryPanel :history="history" :history-limit="historyLimit" @resume="resumeHistory" @remove="removeHistory" />

    <ExamSummary
      v-if="questions.length && examSubmitted"
      :summary="examSummary"
      :type-summary="typeSummary"
      :correct="correctCount"
      :wrong="wrongCount"
      :total="questions.length"
      @show-wrong="showWrongQuestions"
      @redo-wrong="redoWrongQuestions"
    />

    <div v-if="!questions.length" class="empty">请选择题库文件或导入本地 JSON。</div>

    <button v-if="questions.length" class="button index-drawer-toggle" type="button" @click="indexDrawerOpen = true">
      <ListFilter :size="18" />
      题号
    </button>
    <div v-if="questions.length && indexDrawerOpen" class="index-drawer-backdrop" @click="indexDrawerOpen = false"></div>

    <div v-if="questions.length" class="exercise-layout" :class="{ 'all-mode': viewMode === 'all' }">
      <QuestionIndex
        :open="indexDrawerOpen"
        :metrics="metrics"
        :filters="questionFilters"
        :active-filter="questionFilter"
        :items="indexItems"
        @close="indexDrawerOpen = false"
        @set-filter="setQuestionFilter"
        @go-to="onGoToQuestion"
      />

      <div class="question-stack">
        <QuestionCard
          v-for="question in displayedQuestions"
          :key="question.id"
          :question="question"
          :response="responses[question.id]"
          :submitted="Boolean(submitted[question.id])"
          :result="resultsById[question.id]"
          :is-favorite="isFavorite(question.id)"
          :active="activeIndex === question.index"
          :view-mode="viewMode"
          :previous-index="previousIndex ?? null"
          :next-index="nextIndex ?? null"
          @select-option="setOption"
          @set-text="setTextAnswer"
          @submit="submitQuestion"
          @toggle-favorite="toggleFavorite"
          @go-to-index="goToIndex"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Download, FileUp, ListChecks, ListFilter, RotateCcw, Shuffle } from '@lucide/vue'
import { useAppStore } from '@/stores/appStore'
import { useExerciseSession } from '@/features/exercise/useExerciseSession'
import { useExerciseKeyboard } from '@/features/exercise/useExerciseKeyboard'
import { useExtensionReceiver } from '@/features/exercise/useExtensionReceiver'
import { exportBank } from '@/features/exercise/useExerciseExport'
import { questionFilters } from '@/features/exercise/exerciseSession'
import { captureMistake, removeMistake } from '@/services/mistakeBookService'
import { recordAttempt } from '@/services/studyStatsService'
import ProgressBar from '@/components/exercise/ProgressBar.vue'
import ExerciseToolbar from '@/components/exercise/ExerciseToolbar.vue'
import HistoryPanel from '@/components/exercise/HistoryPanel.vue'
import ExamSummary from '@/components/exercise/ExamSummary.vue'
import QuestionIndex from '@/components/exercise/QuestionIndex.vue'
import QuestionCard from '@/components/exercise/QuestionCard.vue'

const route = useRoute()
const appStore = useAppStore()

// Wrong answers feed the cross-bank mistake notebook; answering correctly later removes them.
function handleSubmit(question, response, result) {
  if (!result) return
  recordAttempt({ correct: result.correct, comparable: result.comparable })
  if (result.comparable && !result.correct) {
    const path = sourceKey.value.startsWith('practice/') ? sourceKey.value : ''
    captureMistake(question, response, { bankPath: path, bankTitle: bankTitle.value, reloadable: Boolean(path) })
  } else if (result.correct) {
    removeMistake(question.id)
  }
}

const session = useExerciseSession({ onSubmit: handleSubmit })
const {
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
  resultsById,
  displayedQuestions,
  visibleQuestions,
  answeredCount,
  submittedCount,
  correctCount,
  wrongCount,
  examSummary,
  typeSummary,
  previousIndex,
  nextIndex,
  exportRows,
  answerStatus,
  isFavorite,
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
} = session

const fileInput = ref(null)
const indexDrawerOpen = ref(false)
const toolPreviewStorageKey = '1med:tool-preview-bank'
const mistakesRedoStorageKey = '1med:mistakes-redo-bank'

useExerciseKeyboard(session)

const extension = useExtensionReceiver({
  applyQuestionBank: (raw, title, source) => {
    selectedFilePath.value = ''
    selectedCoursePath.value = ''
    applyQuestionBank(raw, title, source)
  },
  setBankTitle: (value) => {
    bankTitle.value = value
  },
  setLoadError: (value) => {
    loadError.value = value
  },
  getQuestionCount: () => questions.value.length,
  getTitle: () => String(route.query.title || ''),
})

const metrics = computed(() => ({
  total: questions.value.length,
  answered: answeredCount.value,
  submitted: submittedCount.value,
  correct: correctCount.value,
}))

const indexItems = computed(() =>
  visibleQuestions.value.map((question) => {
    const status = answerStatus(question)
    return {
      id: question.id,
      index: question.index,
      question,
      short: status.short,
      label: status.label,
      classes: {
        active: activeIndex.value === question.index,
        answered: status.key === 'answered',
        done: status.key === 'reference',
        correct: status.key === 'correct',
        wrong: status.key === 'wrong',
        reference: status.key === 'reference',
        favorite: favorites.value.has(question.id),
      },
    }
  }),
)

function onGoToQuestion(question) {
  goToQuestion(question)
  indexDrawerOpen.value = false
}

function exportCurrent() {
  exportBank({ rows: exportRows.value, title: bankTitle.value, range: exportRange.value, format: exportFormat.value })
}

function handleFileImport(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const raw = JSON.parse(String(reader.result || '[]'))
      importLocalBank(raw, file.name)
    } catch {
      loadError.value = '导入失败：JSON 格式不正确'
    }
  }
  reader.readAsText(file)
  event.target.value = ''
}

onMounted(async () => {
  await loadCatalog()

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
  } else if (route.query.mistakesRedo === '1') {
    const redoText = localStorage.getItem(mistakesRedoStorageKey)
    localStorage.removeItem(mistakesRedoStorageKey)
    if (!redoText) {
      loadError.value = '错题数据不存在，请回到错题本重新进入。'
      return
    }
    try {
      const raw = JSON.parse(redoText)
      selectedFilePath.value = ''
      applyQuestionBank(raw, String(route.query.title || '错题重做'), `mistakes:redo:${Date.now()}`)
    } catch {
      loadError.value = '错题重做失败：数据格式不正确'
    }
  } else if (Object.prototype.hasOwnProperty.call(route.query, 'extension')) {
    extension.start()
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

.exercise-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 16px;
}

.exercise-layout.all-mode {
  grid-template-columns: 230px 1fr;
}

.index-drawer-toggle,
.index-drawer-backdrop {
  display: none;
}

.question-stack {
  display: grid;
  gap: 16px;
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
}
</style>
