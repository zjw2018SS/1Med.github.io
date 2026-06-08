<template>
  <section class="page-wrap">
    <div class="page-title">
      <div>
        <h1>错题本</h1>
        <p>做错的题会自动收集到这里（跨题库、持久保存），做对后自动移除。</p>
      </div>
      <div class="mistake-actions">
        <button class="button primary" type="button" :disabled="!filtered.length" @click="redo">
          <RotateCcw :size="18" />
          重做这些错题
        </button>
        <button class="button danger" type="button" :disabled="!entries.length" @click="clearAll">
          <Trash2 :size="18" />
          清空
        </button>
      </div>
    </div>

    <div class="toolbar">
      <label class="field">
        <Layers :size="17" />
        <select v-model="subjectFilter">
          <option value="">全部科目</option>
          <option v-for="item in subjects" :key="item" :value="item">{{ item }}</option>
        </select>
      </label>
      <label class="field">
        <ListFilter :size="17" />
        <select v-model="typeFilter">
          <option value="">全部题型</option>
          <option v-for="item in types" :key="item" :value="item">{{ item }}</option>
        </select>
      </label>
      <span class="status">{{ filtered.length }} / {{ entries.length }} 道错题</span>
    </div>

    <div v-if="!entries.length" class="empty">还没有错题。去做题吧，做错的题会自动出现在这里。</div>
    <div v-else-if="!filtered.length" class="empty">没有符合筛选条件的错题。</div>

    <div v-else class="mistake-list">
      <div v-for="item in reviewItems" :key="item.entry.id" class="mistake-entry">
        <div class="mistake-entry__meta">
          <span class="status">{{ item.entry.subject }} · 错 {{ item.entry.wrongCount }} 次</span>
          <button class="button" type="button" @click="resolve(item.entry.id)">
            <CheckCheck :size="16" />
            已掌握 / 移除
          </button>
        </div>
        <QuestionCard :question="item.question" :response="item.response" :result="item.result" review-mode hide-favorite />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CheckCheck, Layers, ListFilter, RotateCcw, Trash2 } from '@lucide/vue'
import { clearMistakes, mistakeBookToBank, readMistakeBook, removeMistake } from '@/services/mistakeBookService'
import { evaluateAnswer } from '@/features/exercise/exerciseCore'
import QuestionCard from '@/components/exercise/QuestionCard.vue'

const router = useRouter()
const book = ref(readMistakeBook())
const subjectFilter = ref('')
const typeFilter = ref('')
const mistakesRedoStorageKey = '1med:mistakes-redo-bank'

const entries = computed(() => Object.values(book.value).sort((a, b) => b.updatedAt - a.updatedAt))
const subjects = computed(() => [...new Set(entries.value.map((item) => item.subject))])
const types = computed(() => [...new Set(entries.value.map((item) => item.snapshot?.typeLabel || item.type))])

const filtered = computed(() =>
  entries.value.filter((item) => {
    if (subjectFilter.value && item.subject !== subjectFilter.value) return false
    if (typeFilter.value && (item.snapshot?.typeLabel || item.type) !== typeFilter.value) return false
    return true
  }),
)

const reviewItems = computed(() =>
  filtered.value.map((entry, index) => {
    const question = { ...entry.snapshot, id: entry.id, index }
    return { entry, question, response: entry.lastResponse, result: evaluateAnswer(question, entry.lastResponse) }
  }),
)

function resolve(id) {
  book.value = { ...removeMistake(id) }
}

function clearAll() {
  clearMistakes()
  book.value = {}
}

function redo() {
  if (!filtered.value.length) return
  const map = Object.fromEntries(filtered.value.map((item) => [item.id, item]))
  localStorage.setItem(mistakesRedoStorageKey, JSON.stringify(mistakeBookToBank(map)))
  router.push({ path: '/practice/exercise', query: { mistakesRedo: '1', title: '错题重做' } })
}
</script>

<style scoped>
.mistake-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.mistake-list {
  display: grid;
  gap: 16px;
}

.mistake-entry {
  display: grid;
  gap: 10px;
}

.mistake-entry__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
</style>
