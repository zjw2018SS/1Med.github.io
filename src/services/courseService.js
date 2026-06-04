import { dataPath, fetchJson } from './assetService.js'

export async function loadLearningCourses() {
  const rows = await fetchJson(dataPath('learning/courses.json'))
  return rows.map((item, index) => ({
    id: `learning-${index}`,
    title: Array.isArray(item.title) ? item.title[0] : item.title || `课程 ${index + 1}`,
    content: Array.isArray(item.content) ? item.content : [],
  }))
}

export async function loadCoursePlan() {
  const rows = await fetchJson(dataPath('courses/course-info.json'))
  return rows.map((item, index) => ({
    id: item.id || `course-${index}`,
    name: item.name || '未命名课程',
    credit: Number(item.credit || 0),
    nature: item.course_nature || '未分类',
    attribute: item.course_attributes || '未设置',
    abbreviation: item.abbreviation || '',
    semester: item.semester || '未设置学期',
  }))
}
