<template>
  <section class="page-wrap">
    <div class="page-title">
      <div>
        <h1>全站搜题</h1>
        <p>在全部 {{ total || '—' }} 道题里按题干关键词检索（只匹配题目正文）。</p>
      </div>
      <RouterLink class="button" to="/practice">
        <ArrowLeft :size="18" />
        返回做题
      </RouterLink>
    </div>

    <div class="toolbar">
      <label class="field search-field">
        <Search :size="17" />
        <input v-model="keyword" type="search" placeholder="输入题干关键词，如「细胞膜」「生理学」" />
      </label>
      <span v-if="!loadError" class="status">{{ statusText }}</span>
      <span v-else class="error-inline">{{ loadError }}</span>
    </div>

    <div v-if="loading" class="loading">正在加载题库索引（首次稍慢，之后会缓存）...</div>
    <div v-else-if="!keyword.trim()" class="empty">输入关键词开始搜索。</div>
    <div v-else-if="!groups.length" class="empty">没有匹配「{{ keyword }}」的题目。</div>

    <div v-else class="search-groups">
      <article v-for="group in groups" :key="group.file.p" class="search-group card">
        <header class="search-group__head">
          <div>
            <strong>{{ group.file.n }}</strong>
            <span>{{ group.file.c }} · {{ group.items.length }} 题命中</span>
          </div>
          <RouterLink class="button primary" :to="{ path: '/practice/exercise', query: { src: group.file.p, title: group.file.n } }">
            <Play :size="16" />
            去做题
          </RouterLink>
        </header>
        <ul class="search-hits">
          <li v-for="item in group.items" :key="`${group.file.p}-${item.questionIndex}`">
            <span class="hit-type">{{ typeLabel(item.type) }}</span>
            <span class="hit-title">{{ item.questionIndex + 1 }}. {{ item.title }}</span>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft, Play, Search } from '@lucide/vue'
import { loadSearchIndex, search } from '@/services/searchService'
import { getQuestionTypeLabel } from '@/features/exercise/exerciseCore'

const RESULT_LIMIT = 200

const keyword = ref('')
const results = ref([])
const total = ref(0)
const loading = ref(false)
const loadError = ref('')
let debounceTimer = 0

const groups = computed(() => {
  const map = new Map()
  for (const item of results.value) {
    const key = item.file.p
    if (!map.has(key)) map.set(key, { file: item.file, items: [] })
    map.get(key).items.push(item)
  }
  return [...map.values()]
})

const statusText = computed(() => {
  if (!keyword.value.trim()) return total.value ? `共 ${total.value} 道题` : ''
  const count = results.value.length
  return count >= RESULT_LIMIT ? `命中较多，仅显示前 ${RESULT_LIMIT} 条` : `命中 ${count} 题`
})

function typeLabel(type) {
  return getQuestionTypeLabel(type)
}

watch(keyword, () => {
  window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(runSearch, 250)
})

async function runSearch() {
  const query = keyword.value.trim()
  if (!query) {
    results.value = []
    return
  }
  loading.value = true
  loadError.value = ''
  try {
    results.value = await search(query, RESULT_LIMIT)
  } catch (reason) {
    loadError.value = reason instanceof Error ? reason.message : '索引加载失败'
  } finally {
    loading.value = false
  }
}

loadSearchIndex()
  .then((index) => {
    total.value = index.total
  })
  .catch((reason) => {
    loadError.value = reason instanceof Error ? reason.message : '索引加载失败'
  })

onBeforeUnmount(() => window.clearTimeout(debounceTimer))
</script>

<style scoped>
.search-field {
  flex: 1 1 320px;
}

.error-inline {
  color: var(--rose);
}

.search-groups {
  display: grid;
  gap: 14px;
}

.search-group {
  padding: 16px 18px;
}

.search-group__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 12px;
}

.search-group__head strong {
  display: block;
  font-size: 16px;
}

.search-group__head span {
  display: block;
  margin-top: 4px;
  color: var(--muted);
  font-size: 13px;
}

.search-hits {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.search-hits li {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--surface-muted);
  line-height: 1.55;
}

.hit-type {
  flex: 0 0 auto;
  padding: 1px 8px;
  border-radius: var(--radius-pill);
  background: var(--brand-soft);
  color: var(--brand-strong);
  font-size: 12px;
}

.hit-title {
  color: var(--text-soft);
}
</style>
