const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const typeRules = [
  { code: 1, label: '单选题', key: 'single', pattern: /单选|A型|single/i },
  { code: 2, label: '多选题', key: 'multiple', pattern: /多选|X型|multiple|multi/i },
  { code: 3, label: '判断题', key: 'judge', pattern: /判断|judge|正确|错误/i },
  { code: 4, label: '填空题', key: 'fill', pattern: /填空|fill/i },
  { code: 5, label: '简答题', key: 'short', pattern: /简答|问答|论述|short/i },
]

export function extractQuestionBank(doc = document) {
  const title = getPaperTitle(doc)
  const questions = getQuestionElements(doc)
    .map((element, index) => extractQuestion(element, index))
    .filter(Boolean)

  if (questions.length === 0) {
    throw new Error('没有识别到学习通题目')
  }

  return createQuestionBank(questions, {
    title,
    time: formatDate(new Date()),
  })
}

export function createQuestionBank(questions, meta = {}) {
  const title = cleanText(meta.title) || '学习通题目'
  return {
    head: {
      version: '1.1.0',
      author: '听雨荷',
      course: '学习通',
      filename: title,
      title: `${title}-【全部】-导出`,
      type_all_num: questions.length,
      time: meta.time || formatDate(new Date()),
      id: meta.id || createId(),
      create_original_index: '1',
    },
    body: questions.map((question, index) => ({
      ...question,
      original_index: question.original_index ?? index,
    })),
  }
}

export function extractQuestion(element, index = 0) {
  const type = detectQuestionType(textOf(element))
  const questionText = cleanQuestionText(textOf(firstMatch(element, ['.mark_name.colorDeep', '.mark_name', '.questionStem', '.stem'])))

  if (!questionText) return null

  const options = type.key === 'judge' ? ['错误', '正确'] : extractOptions(element)
  const answer = extractAnswer(element, type, options)

  return {
    questions: questionText,
    options,
    type: type.label,
    type_code: type.code,
    answers: answer.answers,
    answers_matching_index: answer.indexes,
    analysis: answer.analysis,
    original_index: index,
  }
}

export function detectQuestionType(text = '') {
  const value = cleanText(text)
  return typeRules.find((rule) => rule.pattern.test(value)) || {
    code: 6,
    label: '其它',
    key: 'unknown',
  }
}

export function normalizeOptionText(value) {
  return cleanText(value)
    .replace(/^[A-Z]\s*[.、．）)]\s*/i, '')
    .replace(/^[(（]\s*[A-Z]\s*[)）]\s*/i, '')
    .trim()
}

export function parseChoiceAnswerIndexes(value) {
  const compact = String(value || '').toUpperCase()
  const letters = compact.match(/[A-Z]/g) || []
  return [...new Set(letters.map((letter) => alphabet.indexOf(letter)).filter((index) => index >= 0))]
}

function getQuestionElements(doc) {
  const selectors = ['.mark_item .marBom60.questionLi', '.marBom60.questionLi', '.questionLi.singleQuesId', '.questionLi']
  const seen = new Set()
  const result = []

  selectors.forEach((selector) => {
    doc.querySelectorAll(selector).forEach((element) => {
      if (seen.has(element)) return
      seen.add(element)
      result.push(element)
    })
  })

  return result
}

function getPaperTitle(doc) {
  return cleanText(
    textOf(firstMatch(doc, ['.borderBom.padBom20.detailsHead h2.mark_title', '.mark_title', 'h1', 'title'])) ||
      doc.title ||
      '学习通题目',
  )
}

function extractOptions(element) {
  const nodes = element.querySelectorAll('.mark_letter.colorDeep li, .mark_letter li, ul li')
  return [...nodes]
    .map((node) => normalizeOptionText(textOf(node)))
    .filter(Boolean)
}

function extractAnswer(element, type, options) {
  const answerRoot = firstMatch(element, ['.mark_answer', '.answerCard', '.answer'])
  const analysis = cleanText(textOf(firstMatch(element, ['.analysis', '.mark_answer .analysis'])))

  if (type.key === 'fill' || type.key === 'short') {
    const fillAnswers = answerRoot ? [...answerRoot.querySelectorAll('.mark_fill.colorGreen dd, .mark_fill dd')] : []
    const answers = fillAnswers.map((item) => cleanAnswerText(textOf(item))).filter(Boolean)
    const fallback = cleanAnswerText(extractAnswerText(answerRoot))
    return {
      answers: answers.length ? answers : fallback ? [fallback] : [],
      indexes: [],
      analysis,
    }
  }

  const answerText = cleanAnswerText(extractAnswerText(answerRoot))
  if (type.key === 'judge') {
    return {
      answers: answerText,
      indexes: parseJudgeAnswerIndex(answerText),
      analysis,
    }
  }

  const indexes = parseChoiceAnswerIndexes(answerText).filter((item) => item < options.length)
  return {
    answers: answerText,
    indexes,
    analysis,
  }
}

function extractAnswerText(answerRoot) {
  if (!answerRoot) return ''
  const correct = firstMatch(answerRoot, ['.colorGreen.marginRight40.fl', '.mark_fill.colorGreen', '.colorGreen'])
  if (correct) return textOf(correct)
  const mine = firstMatch(answerRoot, ['.colorDeep.marginRight40.fl', '.colorDeep'])
  return textOf(mine)
}

function parseJudgeAnswerIndex(value) {
  const text = cleanText(value)
  if (/错|错误|×|否|false/i.test(text)) return [0]
  if (/对|正确|√|是|true/i.test(text)) return [1]
  return []
}

function firstMatch(root, selectors) {
  if (!root) return null
  for (const selector of selectors) {
    const found = root.querySelector(selector)
    if (found) return found
  }
  return null
}

function textOf(node) {
  return node?.innerText || node?.textContent || ''
}

function cleanQuestionText(value) {
  return cleanText(value)
    .replace(/^\d+\s*[.、．]\s*/, '')
    .replace(/[（(]\s*(单选题|多选题|判断题|填空题|简答题|其它)\s*[）)]/g, '')
    .trim()
}

function cleanAnswerText(value) {
  return cleanText(value)
    .replace(/^(正确答案|我的答案|参考答案)\s*[:：]?\s*/g, '')
    .replace(/\(\d+\)/g, '')
    .trim()
}

function cleanText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim()
}

function createId() {
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`
}

function formatDate(date) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${String(date.getFullYear()).slice(-2)}年${pad(date.getMonth() + 1)}月${pad(date.getDate())}日${pad(date.getHours())}小时${pad(date.getMinutes())}分${pad(date.getSeconds())}秒`
}
