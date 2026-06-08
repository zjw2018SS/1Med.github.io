import { readStorage, writeStorage } from './storageService.js'
import { subjectFromBankPath } from './questionBankService.js'
import { evaluateAnswer } from '../features/exercise/exerciseCore.js'

const MISTAKES_KEY = 'mistakes:items'
export const MISTAKE_CAP = 800

const typeCodeByType = { single: '1', multiple: '2', judge: '3', fill: '4', short: '5' }

export function readMistakeBook() {
  const data = readStorage(MISTAKES_KEY, {})
  return data && typeof data === 'object' && !Array.isArray(data) ? data : {}
}

// Captures a wrong answer. No-op (returns current book) when the answer is correct
// or not auto-gradable (short answer). Stable question.id keeps entries deduped across sessions.
export function captureMistake(question, response, context = {}) {
  if (!question) return readMistakeBook()
  const result = evaluateAnswer(question, response)
  if (!result.comparable || result.correct) return readMistakeBook()

  const { bankPath = '', bankTitle = '', reloadable = false } = context
  const items = readMistakeBook()
  const existing = items[question.id]
  const now = Date.now()

  items[question.id] = {
    id: question.id,
    bankPath,
    bankTitle,
    reloadable,
    subject: subjectFromBankPath(bankPath) || bankTitle || '未分类',
    type: question.type,
    snapshot: {
      title: question.title,
      type: question.type,
      typeLabel: question.typeLabel,
      options: question.options,
      answerText: question.answerText,
      answerIndexes: question.answerIndexes,
      analysis: question.analysis,
    },
    wrongCount: (existing?.wrongCount || 0) + 1,
    lastResponse: response,
    addedAt: existing?.addedAt || now,
    updatedAt: now,
  }

  return persistWithCap(items)
}

export function removeMistake(id) {
  const items = readMistakeBook()
  if (!items[id]) return items
  delete items[id]
  writeMistakeBook(items)
  return items
}

export function clearMistakes() {
  writeMistakeBook({})
  return {}
}

export function mistakeStats(items = readMistakeBook()) {
  const list = Object.values(items)
  const byType = {}
  const bySubject = {}
  list.forEach((item) => {
    const typeLabel = item.snapshot?.typeLabel || item.type || '题目'
    byType[typeLabel] = (byType[typeLabel] || 0) + 1
    bySubject[item.subject] = (bySubject[item.subject] || 0) + 1
  })
  return { total: list.length, byType, bySubject }
}

// Rebuilds a raw-shaped bank from snapshots so the existing exercise engine can re-run them.
export function mistakeBookToBank(items = readMistakeBook()) {
  return Object.values(items).map((item) => {
    const snapshot = item.snapshot || {}
    return {
      questions: [snapshot.title || ''],
      type: [snapshot.typeLabel || ''],
      type_code: typeCodeByType[snapshot.type] || '',
      options: snapshot.options || [],
      answers: snapshot.answerText ? [snapshot.answerText] : [],
      answers_matching_index: snapshot.answerIndexes || [],
      analysis: snapshot.analysis ? [snapshot.analysis] : [],
    }
  })
}

function writeMistakeBook(items) {
  return writeStorage(MISTAKES_KEY, items)
}

// Keeps the book under MISTAKE_CAP (evict lowest wrongCount, then oldest) and
// degrades gracefully if the browser rejects the write (quota) by dropping ~10% and retrying once.
function persistWithCap(items) {
  let next = items
  if (Object.keys(next).length > MISTAKE_CAP) {
    next = keepTop(next, MISTAKE_CAP)
  }
  if (writeMistakeBook(next)) return next

  const reduced = keepTop(next, Math.max(0, Object.keys(next).length - Math.ceil(Object.keys(next).length * 0.1)))
  writeMistakeBook(reduced)
  return reduced
}

function keepTop(items, count) {
  const sorted = Object.values(items).sort(priorityAscending)
  const kept = sorted.slice(Math.max(0, sorted.length - count))
  return Object.fromEntries(kept.map((item) => [item.id, item]))
}

// Ascending priority: lowest wrongCount first, oldest first — i.e. the first to be evicted.
function priorityAscending(a, b) {
  if (a.wrongCount !== b.wrongCount) return a.wrongCount - b.wrongCount
  return a.updatedAt - b.updatedAt
}
