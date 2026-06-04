const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const cjkBetweenSpacesPattern = /([\u3400-\u9fff\uf900-\ufaff])\s+(?=[\u3400-\u9fff\uf900-\ufaff])/g
const fillAnswerSeparatorPattern = /[;\uFF1B|]/g
const loosePunctuationPattern = /[\s\p{P}]+/gu

export function normalizeQuestionBank(raw, sourceName = 'question-bank') {
  const rows = Array.isArray(raw) ? raw : Array.isArray(raw?.body) ? raw.body : []
  return rows.map((item, index) => normalizeQuestion(item, index, sourceName)).filter(Boolean)
}

export function normalizeQuestion(item, index = 0, sourceName = 'question-bank') {
  if (!item || typeof item !== 'object') return null

  const questionText = firstText(item.questions) || item.title || item.question || item.name || ''
  const typeLabel = firstText(item.type) || item.type || ''
  const type = normalizeQuestionType(item.type_code, typeLabel)
  const options = normalizeOptions(item.options)
  const rawAnswers = normalizeAnswerArray(item.answers ?? item.answer ?? item.correctAnswer)
  const answerIndexes = normalizeAnswerIndexes(item.answers_matching_index, rawAnswers, options)
  const analysis = normalizeAnswerArray(item.analysis).join('\n')

  return {
    id: `${sourceName}-${index}-${hashText(questionText)}`,
    index,
    title: cleanText(questionText) || `第 ${index + 1} 题`,
    type,
    typeLabel: getQuestionTypeLabel(type, typeLabel),
    options,
    answerText: rawAnswers.join('；'),
    answerIndexes,
    analysis: cleanText(analysis),
    raw: item,
  }
}

export function evaluateAnswer(question, response) {
  if (!question) return { correct: false, comparable: false }

  if (question.type === 'single' || question.type === 'multiple' || question.type === 'judge') {
    const selected = Array.isArray(response) ? response : response == null || response === '' ? [] : [response]
    const selectedIndexes = selected.map(Number).filter((item) => Number.isInteger(item)).sort((a, b) => a - b)
    const expected = [...question.answerIndexes].sort((a, b) => a - b)
    return {
      correct: expected.length > 0 && sameArray(selectedIndexes, expected),
      comparable: expected.length > 0,
      selectedIndexes,
      expectedIndexes: expected,
    }
  }

  if (question.type === 'fill') {
    const expected = splitFillAnswerText(question.answerText)
      .flatMap((item) => item.split(/[;；|]/))
      .map(normalizeLooseText)
      .filter(Boolean)
    const actual = splitFillAnswerText(response).map(normalizeLooseText).filter(Boolean)
    return {
      correct: expected.length > 0 && actual.length === expected.length && expected.every((item, index) => item === actual[index]),
      comparable: expected.length > 0,
      expectedText: question.answerText,
    }
  }

  return {
    correct: false,
    comparable: false,
    expectedText: question.answerText,
  }
}

export function shuffleQuestions(questions) {
  const next = [...questions]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

export function getQuestionTypeLabel(type, fallback = '') {
  const map = {
    single: '单选题',
    multiple: '多选题',
    judge: '判断题',
    fill: '填空题',
    short: '简答题',
    unknown: fallback || '题目',
  }
  return map[type] || fallback || '题目'
}

export function responseToText(question, response) {
  if (!question) return ''
  if (question.type === 'single' || question.type === 'multiple' || question.type === 'judge') {
    const selected = Array.isArray(response) ? response : response == null || response === '' ? [] : [response]
    return selected
      .map((index) => `${alphabet[Number(index)] || ''}. ${question.options[Number(index)] || ''}`.trim())
      .join('；')
  }
  return Array.isArray(response) ? response.join('；') : response || ''
}

export function buildQuestionExportRows(questions, state = {}) {
  const responses = state.responses || {}
  const submitted = state.submitted || {}
  const favoriteSet = new Set(state.favorites || [])

  return questions.map((question) => {
    const response = responses[question.id]
    const result = evaluateAnswer(question, response)
    const isSubmitted = Boolean(submitted[question.id])

    return {
      id: question.id,
      index: question.index + 1,
      title: question.title,
      type: question.typeLabel,
      options: question.options.map((option, index) => `${alphabet[index]}. ${option}`),
      answer: question.answerText,
      referenceAnswer: question.answerIndexes.length
        ? question.answerIndexes.map((index) => `${alphabet[index]}. ${question.options[index] || ''}`)
        : question.answerText,
      analysis: question.analysis,
      userAnswer: responseToText(question, response),
      isSubmitted,
      isCorrect: isSubmitted && result.comparable ? result.correct : null,
      isFavorite: favoriteSet.has(question.id),
    }
  })
}

export function filterQuestionExportRows(rows, range = 'all') {
  switch (range) {
    case 'submitted':
      return rows.filter((row) => row.isSubmitted)
    case 'wrong':
      return rows.filter((row) => row.isSubmitted && row.isCorrect === false)
    case 'favorites':
      return rows.filter((row) => row.isFavorite)
    default:
      return rows
  }
}

export function formatExportContent(rows, meta = {}, format = 'json') {
  const payload = {
    title: meta.title || '题库导出',
    range: meta.range || 'all',
    exportedAt: new Date(meta.exportedAt || Date.now()).toISOString(),
    total: rows.length,
    questions: rows,
  }

  if (format === 'txt') return formatTextExport(payload)
  if (format === 'csv') return formatCsvExport(payload.questions)
  return JSON.stringify(payload, null, 2)
}

function formatTextExport(payload) {
  const lines = [
    payload.title,
    `导出时间：${payload.exportedAt}`,
    `题目数量：${payload.total}`,
    '',
  ]

  payload.questions.forEach((row) => {
    lines.push(`${row.index}. 【${row.type}】${row.title}`)
    if (row.options.length) lines.push(...row.options)
    lines.push(`正确答案：${arrayToText(row.referenceAnswer) || row.answer || '暂无'}`)
    lines.push(`我的答案：${row.userAnswer || '未作答'}`)
    lines.push(`状态：${row.isCorrect === null ? (row.isSubmitted ? '已提交' : '未提交') : row.isCorrect ? '正确' : '错误'}`)
    if (row.analysis) lines.push(`解析：${row.analysis}`)
    lines.push('')
  })

  return lines.join('\n')
}

function formatCsvExport(rows) {
  const headers = ['序号', '题型', '题目', '选项', '正确答案', '我的答案', '是否提交', '是否正确', '是否收藏', '解析']
  const body = rows.map((row) => [
    row.index,
    row.type,
    row.title,
    row.options.join('\n'),
    arrayToText(row.referenceAnswer) || row.answer,
    row.userAnswer,
    row.isSubmitted ? '是' : '否',
    row.isCorrect === null ? '' : row.isCorrect ? '是' : '否',
    row.isFavorite ? '是' : '否',
    row.analysis,
  ])

  return [headers, ...body].map((row) => row.map(csvCell).join(',')).join('\n')
}

function csvCell(value) {
  const text = String(value ?? '')
  return `"${text.replace(/"/g, '""')}"`
}

function arrayToText(value) {
  return Array.isArray(value) ? value.join('；') : value || ''
}

function normalizeQuestionType(code, label) {
  const normalizedCode = String(code || '').trim()
  const normalizedLabel = String(label || '').trim()

  if (normalizedCode === '1' || /单选|single/i.test(normalizedLabel)) return 'single'
  if (normalizedCode === '2' || /多选|multiple|multi/i.test(normalizedLabel)) return 'multiple'
  if (normalizedCode === '3' || /判断|judge|true/i.test(normalizedLabel)) return 'judge'
  if (normalizedCode === '4' || /填空|fill/i.test(normalizedLabel)) return 'fill'
  if (normalizedCode === '5' || /简答|问答|论述|short|qa/i.test(normalizedLabel)) return 'short'
  return 'unknown'
}

function normalizeOptions(options) {
  if (Array.isArray(options)) return options.map(cleanText)
  if (options && typeof options === 'object') {
    return Object.keys(options)
      .sort()
      .map((key) => cleanText(options[key]))
  }
  return []
}

function normalizeAnswerArray(value) {
  if (Array.isArray(value)) return value.map(cleanText).filter((item) => item !== '')
  if (value == null) return []
  return [cleanText(value)].filter((item) => item !== '')
}

function normalizeAnswerIndexes(indexes, answers, options) {
  if (Array.isArray(indexes) && indexes.length) {
    return indexes.map(Number).filter((item) => Number.isInteger(item) && item >= 0)
  }

  const fromLetters = parseAnswerLetters(answers.join(''))
  if (fromLetters.length) return fromLetters

  const normalizedOptions = options.map(normalizeLooseText)
  return answers
    .map(normalizeLooseText)
    .map((answer) => normalizedOptions.indexOf(answer))
    .filter((index) => index >= 0)
}

function parseAnswerLetters(value) {
  const compact = String(value || '').toUpperCase().replace(/[^A-Z]/g, '')
  if (!compact || compact.length > 12) return []
  return [...new Set([...compact].map((letter) => alphabet.indexOf(letter)).filter((index) => index >= 0))]
}

function firstText(value) {
  if (Array.isArray(value)) return value.find((item) => cleanText(item))
  return value
}

function cleanText(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .replace(cjkBetweenSpacesPattern, '$1')
    .trim()
}

function splitFillAnswerText(value) {
  const rows = Array.isArray(value) ? value : normalizeAnswerArray(value)
  return rows.flatMap((item) => String(item).split(fillAnswerSeparatorPattern)).map(cleanText).filter(Boolean)
}

function normalizeLooseText(value) {
  return cleanText(value).normalize('NFKC').replace(loosePunctuationPattern, '').toLowerCase()
}

function sameArray(a, b) {
  return a.length === b.length && a.every((item, index) => item === b[index])
}

function hashText(value) {
  let hash = 0
  const text = String(value || '')
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString(36)
}
