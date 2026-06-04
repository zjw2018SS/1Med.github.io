<template>
  <section class="page-wrap">
    <div class="page-title">
      <div>
        <h1>课程信息</h1>
        <p>按学期、课程性质和学分查看培养方案课程。</p>
      </div>
    </div>

    <div class="toolbar">
      <label class="field">
        <Search :size="17" />
        <input v-model="keyword" type="search" placeholder="搜索课程名称" />
      </label>
      <label class="field">
        <CalendarDays :size="17" />
        <select v-model="semester">
          <option value="">全部学期</option>
          <option v-for="item in semesters" :key="item" :value="item">{{ item }}</option>
        </select>
      </label>
      <label class="field">
        <ArrowUpDown :size="17" />
        <select v-model="sortMode">
          <option value="asc">课程顺序</option>
          <option value="desc">课程逆序</option>
          <option value="creditAsc">学分升序</option>
          <option value="creditDesc">学分降序</option>
        </select>
      </label>
      <span class="status">总学分 {{ totalCredit }}</span>
    </div>

    <div v-if="loading" class="loading">正在加载课程信息...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="course-table card">
      <table>
        <thead>
          <tr>
            <th>课程名称</th>
            <th>学期</th>
            <th>学分</th>
            <th>性质</th>
            <th>属性</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredCourses" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.semester }}</td>
            <td>{{ item.credit }}</td>
            <td>{{ item.nature }}</td>
            <td>{{ item.attribute }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ArrowUpDown, CalendarDays, Search } from '@lucide/vue'
import { loadCoursePlan } from '@/services/courseService'

const courses = ref([])
const keyword = ref('')
const semester = ref('')
const sortMode = ref('asc')
const loading = ref(true)
const error = ref('')

const semesters = computed(() => [...new Set(courses.value.map((item) => item.semester))])

const filteredCourses = computed(() => {
  const key = keyword.value.trim().toLowerCase()
  const rows = courses.value.filter((item) => {
    return (!semester.value || item.semester === semester.value) && (!key || item.name.toLowerCase().includes(key))
  })
  if (sortMode.value === 'desc') return [...rows].reverse()
  if (sortMode.value === 'creditAsc') return [...rows].sort(compareCredit)
  if (sortMode.value === 'creditDesc') return [...rows].sort((a, b) => compareCredit(b, a))
  return rows
})

const totalCredit = computed(() => filteredCourses.value.reduce((sum, item) => sum + item.credit, 0).toFixed(1))

function compareCredit(a, b) {
  if (a.credit !== b.credit) return a.credit - b.credit
  return a.name.localeCompare(b.name, 'zh-Hans-CN')
}

onMounted(async () => {
  try {
    courses.value = await loadCoursePlan()
  } catch (reason) {
    error.value = reason instanceof Error ? reason.message : '课程信息加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.course-table {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
}

th,
td {
  padding: 13px 14px;
  border-bottom: 1px solid var(--line);
  text-align: left;
}

th {
  color: var(--text-soft);
  background: var(--surface-soft);
  font-size: 14px;
}

td {
  color: var(--text);
}
</style>
