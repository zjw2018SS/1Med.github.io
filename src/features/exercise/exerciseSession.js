// Pure, framework-free helpers extracted from ExercisePage.
// Kept side-effect free so they can be unit-tested with `node --test`.

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const questionFilters = [
  { key: 'all', label: '全部' },
  { key: 'unanswered', label: '未答' },
  { key: 'answered', label: '已答' },
  { key: 'wrong', label: '错题' },
  { key: 'favorites', label: '收藏' },
]

const exportRangeLabels = {
  all: '全部',
  submitted: '已提交',
  wrong: '错题',
  favorites: '收藏',
}

export function optionLetter(index) {
  return alphabet[index] || String.fromCharCode(65 + Number(index))
}

export function optionIndexFromShortcut(key) {
  if (/^[1-8]$/.test(key)) return Number(key) - 1
  const code = String(key).toUpperCase().charCodeAt(0)
  if (code >= 65 && code <= 72) return code - 65
  return null
}

export function isTypingTarget(target) {
  if (!target || typeof target !== 'object') return false
  if (target.isContentEditable) return true
  const tagName = String(target.tagName || '').toLowerCase()
  return ['input', 'textarea', 'select'].includes(tagName)
}

export function responseHasValue(value) {
  if (Array.isArray(value)) return value.length > 0
  return value != null && String(value).trim() !== ''
}

export function toggleMultipleOption(current, optionIndex, checked) {
  const next = Array.isArray(current) ? [...current] : []
  if (checked && !next.includes(optionIndex)) next.push(optionIndex)
  if (!checked) {
    const at = next.indexOf(optionIndex)
    if (at >= 0) next.splice(at, 1)
  }
  return next.sort((a, b) => a - b)
}

export function canAutoSubmit(question, autoSubmitSingles) {
  return Boolean(autoSubmitSingles) && ['single', 'judge'].includes(question?.type) && question?.answerIndexes?.length === 1
}

// status from already-computed pieces: submitted (bool), result (evaluateAnswer output), answered (bool)
export function answerStatus({ submitted, result, answered }) {
  if (submitted && result?.correct) return { key: 'correct', label: '正确', short: '对' }
  if (submitted && result?.comparable) return { key: 'wrong', label: '错误', short: '错' }
  if (submitted) return { key: 'reference', label: '已提交', short: '交' }
  if (answered) return { key: 'answered', label: '已作答', short: '答' }
  return { key: 'unanswered', label: '未作答', short: '未' }
}

export function matchesQuestionFilter(filterKey, { answered, submitted, result, favorite }) {
  if (filterKey === 'unanswered') return !answered
  if (filterKey === 'answered') return answered
  if (filterKey === 'wrong') return Boolean(submitted) && Boolean(result?.comparable) && !result?.correct
  if (filterKey === 'favorites') return Boolean(favorite)
  return true
}

export function resultLabelFor(result) {
  if (result?.correct) return '回答正确'
  if (result?.comparable) return '回答错误'
  return '参考答案'
}

export function referenceAnswer(question) {
  if (question?.answerIndexes?.length && question?.options?.length) {
    return question.answerIndexes.map((index) => `${optionLetter(index)}. ${question.options[index] || ''}`).join('；')
  }
  return question?.answerText || '暂无参考答案'
}

export function progressKey(sourceKey, bankTitle) {
  return `exercise:${sourceKey || bankTitle}`
}

export function exportRangeLabel(range) {
  return exportRangeLabels[range] || '导出'
}

export function safeFileName(value) {
  return String(value || '题库导出')
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
}

// chaoxingRedo userscript bridge payloads. Pure so it can be tested without DOM.
export function parseExtensionPayload(data) {
  if (typeof data === 'string') {
    const text = data.trim()
    if (!text || !/^[{[]/.test(text)) return null
    return JSON.parse(text)
  }
  if (Array.isArray(data) || Array.isArray(data?.body)) return data
  return null
}
