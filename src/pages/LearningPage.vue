<template>
  <section class="page-wrap">
    <div class="page-title">
      <div>
        <h1>学习资料</h1>
        <p>按课程检索网课、笔记、题库和资料链接。</p>
      </div>
      <a class="button" :href="assetPath('static/学习资料/learning_pdf.html')" target="_blank" rel="noopener noreferrer">
        <FileText :size="18" />
        资料文件
      </a>
    </div>

    <div class="toolbar">
      <label class="field">
        <Search :size="17" />
        <input v-model="keyword" type="search" placeholder="搜索课程或资料" />
      </label>
      <label class="field">
        <ArrowUpDown :size="17" />
        <select v-model="sortDirection">
          <option value="asc">课程顺序</option>
          <option value="desc">课程逆序</option>
        </select>
      </label>
      <span class="status">{{ filteredCourses.length }} 门课程</span>
      <span class="status">{{ totalLinks }} 条链接</span>
    </div>

    <div v-if="loading" class="loading">正在加载学习资料...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="filteredCourses.length === 0" class="empty">没有匹配的资料。</div>

    <div v-else class="learning-list">
      <article v-for="course in filteredCourses" :key="course.id" class="course-card card">
        <button class="course-title" type="button" @click="toggle(course.id)">
          <span>{{ course.title }}</span>
          <ChevronDown :class="{ open: opened.has(course.id) }" :size="18" />
        </button>
        <div v-show="opened.has(course.id)" class="course-links">
          <a v-for="item in course.content" :key="item.href + item.course" :href="item.href" target="_blank" rel="noopener noreferrer">
            <ExternalLink :size="16" />
            <span>{{ item.course }}</span>
          </a>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ArrowUpDown, ChevronDown, ExternalLink, FileText, Search } from '@lucide/vue'
import { loadLearningCourses } from '@/services/courseService'
import { assetPath } from '@/services/assetService'

const courses = ref([])
const opened = ref(new Set())
const keyword = ref('')
const sortDirection = ref('asc')
const loading = ref(true)
const error = ref('')

const filteredCourses = computed(() => {
  const key = keyword.value.trim().toLowerCase()
  const rows = key ? courses.value.filter((course) => {
    const text = `${course.title} ${course.content.map((item) => item.course).join(' ')}`.toLowerCase()
    return text.includes(key)
  }) : courses.value
  return sortDirection.value === 'desc' ? [...rows].reverse() : rows
})

const totalLinks = computed(() => filteredCourses.value.reduce((sum, item) => sum + item.content.length, 0))

function toggle(id) {
  const next = new Set(opened.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  opened.value = next
}

onMounted(async () => {
  try {
    courses.value = await loadLearningCourses()
    opened.value = new Set(courses.value.slice(0, 3).map((item) => item.id))
  } catch (reason) {
    error.value = reason instanceof Error ? reason.message : '学习资料加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.learning-list {
  display: grid;
  gap: 12px;
}

.course-card {
  overflow: hidden;
}

.course-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 56px;
  padding: 0 18px;
  border: 0;
  color: var(--text);
  background: var(--surface);
  font-weight: 700;
  font-size: 16px;
  text-align: left;
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease);
}

.course-title:hover {
  color: var(--brand-strong);
  background: var(--hover-surface);
}

.course-title svg {
  flex: 0 0 auto;
  color: var(--muted);
  transition: transform var(--dur) var(--ease);
}

.course-title svg.open {
  transform: rotate(180deg);
}

.course-links {
  display: grid;
  gap: 1px;
  border-top: 1px solid var(--line);
  background: var(--line);
}

.course-links a {
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 44px;
  padding: 9px 18px;
  background: var(--surface-muted);
  color: var(--text-soft);
  line-height: 1.45;
  transition: color var(--dur) var(--ease), background var(--dur) var(--ease), padding var(--dur) var(--ease);
}

.course-links a svg {
  flex: 0 0 auto;
  color: var(--muted);
}

.course-links a:hover {
  color: var(--brand-strong);
  background: var(--brand-soft);
  padding-left: 22px;
}

.course-links a:hover svg {
  color: var(--brand);
}
</style>
