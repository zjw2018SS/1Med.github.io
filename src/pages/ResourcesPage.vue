<template>
  <section class="page-wrap">
    <div class="page-title">
      <div>
        <h1>工具资源</h1>
        <p>整理本站题库生产、格式转换和维护工具。</p>
      </div>
    </div>

    <div class="toolbar">
      <label class="field">
        <Search :size="17" />
        <input v-model="keyword" type="search" placeholder="搜索工具或分类" />
      </label>
      <label class="field">
        <Filter :size="17" />
        <select v-model="category">
          <option value="">全部分类</option>
          <option v-for="item in categories" :key="item" :value="item">{{ item }}</option>
        </select>
      </label>
      <label class="field">
        <ArrowUpDown :size="17" />
        <select v-model="sortDirection">
          <option value="asc">资源顺序</option>
          <option value="desc">资源逆序</option>
        </select>
      </label>
      <span class="status">{{ filteredResources.length }} 个资源</span>
    </div>

    <div class="grid three">
      <article v-for="item in filteredResources" :key="item.id" class="resource-card card">
        <div class="resource-card__head">
          <h2>{{ item.name }}</h2>
          <span>{{ item.platform }}</span>
        </div>
        <p>{{ item.description }}</p>
        <div class="resource-card__footer">
          <span class="status">{{ item.category }}</span>
          <a v-if="item.href" class="icon-button" :href="item.href" target="_blank" rel="noopener noreferrer" title="打开链接">
            <ExternalLink :size="17" />
          </a>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ArrowUpDown, ExternalLink, Filter, Search } from '@lucide/vue'
import { loadResources } from '@/services/resourceService'

const resources = ref([])
const keyword = ref('')
const category = ref('')
const sortDirection = ref('asc')

const categories = computed(() => [...new Set(resources.value.map((item) => item.category))])

const filteredResources = computed(() => {
  const key = keyword.value.trim().toLowerCase()
  const rows = resources.value.filter((item) => {
    const matchedCategory = !category.value || item.category === category.value
    const text = `${item.name} ${item.description} ${item.category} ${item.platform}`.toLowerCase()
    return matchedCategory && (!key || text.includes(key))
  })
  return sortDirection.value === 'desc' ? [...rows].reverse() : rows
})

onMounted(async () => {
  resources.value = await loadResources()
})
</script>

<style scoped>
.resource-card {
  display: grid;
  gap: 14px;
  min-height: 190px;
  padding: 18px;
}

.resource-card__head,
.resource-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.resource-card h2 {
  margin: 0;
  font-size: 20px;
}

.resource-card__head span {
  color: var(--muted);
  font-size: 13px;
  white-space: nowrap;
}

.resource-card p {
  margin: 0;
  color: var(--muted);
  line-height: 1.65;
}
</style>
