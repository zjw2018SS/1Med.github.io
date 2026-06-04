<template>
  <section class="page-wrap">
    <div class="page-title">
      <div>
        <h1>在线做题</h1>
        <p>读取统一题库目录，也可以在练习页导入本地 JSON。</p>
      </div>
      <RouterLink class="button primary" to="/practice/exercise">
        <Play :size="18" />
        打开练习台
      </RouterLink>
    </div>

    <div class="toolbar">
      <label class="field">
        <Search :size="17" />
        <input v-model="keyword" type="search" placeholder="搜索课程题库" />
      </label>
      <label class="field">
        <ArrowUpDown :size="17" />
        <select v-model="sortDirection">
          <option value="asc">目录顺序</option>
          <option value="desc">目录逆序</option>
        </select>
      </label>
      <span class="status">{{ filteredCatalog.length }} 个课程目录</span>
    </div>

    <section v-if="history.length" class="history-panel card">
      <div class="history-panel__head">
        <div>
          <h2><History :size="18" /> 做题历史</h2>
          <p>继续上次进度，或清空某个题库的答案重新做。</p>
        </div>
        <label class="field">
          <select v-model.number="historyLimit">
            <option :value="6">保留 6 条</option>
            <option :value="12">保留 12 条</option>
            <option :value="20">保留 20 条</option>
            <option :value="30">保留 30 条</option>
          </select>
        </label>
      </div>

      <div class="history-grid">
        <article v-for="entry in history" :key="entry.id" class="history-card">
          <div>
            <strong>{{ entry.title }}</strong>
            <span>{{ entry.answered }}/{{ entry.total }} 已答 · {{ entry.submitted }} 已交 · {{ entry.wrong }} 错</span>
          </div>
          <div class="history-actions">
            <RouterLink
              v-if="entry.reloadable"
              class="button primary"
              :to="{ path: '/practice/exercise', query: { src: entry.path, title: entry.title } }"
              target="_blank"
              rel="noopener noreferrer"
            >
              继续
            </RouterLink>
            <button v-else class="button primary" type="button" disabled>继续</button>
            <RouterLink
              v-if="entry.reloadable"
              class="button"
              :to="{ path: '/practice/exercise', query: { src: entry.path, title: entry.title, restart: '1' } }"
              target="_blank"
              rel="noopener noreferrer"
            >
              重做
            </RouterLink>
            <button class="icon-button" type="button" title="删除记录" @click="removeHistory(entry)">
              <XCircle :size="17" />
            </button>
          </div>
        </article>
      </div>
    </section>

    <div v-if="loading" class="loading">正在加载题库目录...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="practice-layout">
      <aside class="catalog-list card">
        <button
          v-for="item in filteredCatalog"
          :key="item.id"
          type="button"
          :class="{ active: selectedCourse?.id === item.id }"
          @click="selectCourse(item)"
        >
          <FolderOpen :size="17" />
          <span>{{ item.name }}</span>
        </button>
      </aside>

      <section class="file-panel card">
        <div class="file-panel__head">
          <h2>{{ selectedCourse?.name || '选择一个课程目录' }}</h2>
          <span v-if="files.length" class="status">{{ files.length }} 个题库文件</span>
        </div>

        <div v-if="fileLoading" class="loading">正在读取题库文件...</div>
        <div v-else-if="fileError" class="error">{{ fileError }}</div>
        <div v-else-if="!selectedCourse" class="empty">从左侧选择课程目录。</div>
        <div v-else-if="files.length === 0" class="empty">该目录没有可读取的题库文件。</div>
        <div v-else class="file-list">
          <RouterLink
            v-for="file in files"
            :key="file.id"
            class="file-row"
            :to="{ path: '/practice/exercise', query: { src: file.path, title: file.name } }"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileQuestion :size="17" />
            <span>{{ file.name }}</span>
            <ChevronRight :size="17" />
          </RouterLink>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowUpDown, ChevronRight, FileQuestion, FolderOpen, History, Play, Search, XCircle } from '@lucide/vue'
import { loadQuestionCatalog, loadQuestionFiles } from '@/services/questionBankService'
import {
  clearExerciseProgress,
  normalizeHistoryLimit,
  readExerciseHistory,
  readExerciseSettings,
  removeExerciseHistory,
  writeExerciseSettings,
} from '@/services/exerciseHistoryService'

const catalog = ref([])
const files = ref([])
const selectedCourse = ref(null)
const keyword = ref('')
const sortDirection = ref('asc')
const loading = ref(true)
const fileLoading = ref(false)
const error = ref('')
const fileError = ref('')
const settings = readExerciseSettings()
const history = ref(readExerciseHistory())
const historyLimit = ref(settings.historyLimit)

const filteredCatalog = computed(() => {
  const key = keyword.value.trim().toLowerCase()
  const rows = key ? catalog.value.filter((item) => item.name.toLowerCase().includes(key)) : catalog.value
  return sortDirection.value === 'desc' ? [...rows].reverse() : rows
})

watch(historyLimit, () => {
  historyLimit.value = normalizeHistoryLimit(historyLimit.value)
  writeExerciseSettings({ ...readExerciseSettings(), historyLimit: historyLimit.value })
})

async function selectCourse(course) {
  selectedCourse.value = course
  files.value = []
  fileError.value = ''
  fileLoading.value = true
  try {
    files.value = await loadQuestionFiles(course.path)
  } catch (reason) {
    fileError.value = reason instanceof Error ? reason.message : '题库文件读取失败'
  } finally {
    fileLoading.value = false
  }
}

function removeHistory(entry) {
  if (entry.progressKey) clearExerciseProgress(entry.progressKey)
  history.value = removeExerciseHistory(entry.id)
}

onMounted(async () => {
  history.value = readExerciseHistory()
  try {
    catalog.value = await loadQuestionCatalog()
    if (catalog.value[0]) await selectCourse(catalog.value[0])
  } catch (reason) {
    error.value = reason instanceof Error ? reason.message : '题库目录加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.practice-layout {
  display: grid;
  grid-template-columns: minmax(260px, 340px) 1fr;
  gap: 16px;
}

.catalog-list {
  max-height: calc(100vh - 170px);
  overflow: auto;
  padding: 8px;
}

.catalog-list button {
  display: grid;
  grid-template-columns: 20px 1fr;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 42px;
  padding: 8px 10px;
  border: 0;
  border-radius: 7px;
  color: var(--text-soft);
  background: transparent;
  text-align: left;
}

.catalog-list button.active,
.catalog-list button:hover {
  color: var(--brand-strong);
  background: var(--surface-soft);
}

.file-panel {
  min-height: 420px;
  padding: 18px;
}

.file-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
}

.file-panel h2 {
  margin: 0;
  font-size: 22px;
}

.file-list {
  display: grid;
  gap: 8px;
}

.file-row {
  display: grid;
  grid-template-columns: 20px 1fr 20px;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--surface-muted);
}

.file-row:hover {
  color: var(--brand-strong);
  border-color: rgba(36, 122, 99, 0.28);
}

.history-panel {
  margin-bottom: 16px;
  padding: 18px;
}

.history-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}

.history-panel h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 20px;
}

.history-panel p {
  margin: 6px 0 0;
  color: var(--muted);
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 10px;
  max-height: 320px;
  overflow: auto;
  padding-right: 4px;
}

.history-card {
  display: grid;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--surface-muted);
}

.history-card strong,
.history-card span {
  display: block;
}

.history-card span {
  margin-top: 6px;
  color: var(--muted);
  font-size: 13px;
}

.history-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 900px) {
  .practice-layout {
    grid-template-columns: 1fr;
  }

  .catalog-list {
    max-height: 300px;
  }
}
</style>
