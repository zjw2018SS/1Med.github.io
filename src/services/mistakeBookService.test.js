import test from 'node:test'
import assert from 'node:assert/strict'

import { normalizeQuestion, normalizeQuestionBank, evaluateAnswer } from '../features/exercise/exerciseCore.js'
import { writeStorage } from './storageService.js'
import {
  MISTAKE_CAP,
  captureMistake,
  clearMistakes,
  mistakeBookToBank,
  mistakeStats,
  readMistakeBook,
  removeMistake,
} from './mistakeBookService.js'

function installMemoryStorage(maxBytes = Infinity) {
  const values = new Map()
  globalThis.localStorage = {
    get length() {
      return values.size
    },
    clear() {
      values.clear()
    },
    getItem(key) {
      return values.has(key) ? values.get(key) : null
    },
    key(index) {
      return [...values.keys()][index] || null
    },
    removeItem(key) {
      values.delete(key)
    },
    setItem(key, value) {
      const text = String(value)
      if (text.length > maxBytes) {
        const error = new Error('quota')
        error.name = 'QuotaExceededError'
        throw error
      }
      values.set(key, text)
    },
  }
}

function singleChoice(index, { subject = '生理学' } = {}) {
  return normalizeQuestion(
    { questions: [`Q${index}`], type: ['单选题'], type_code: '1', options: ['a', 'b', 'c'], answers: ['A'] },
    index,
    `practice/banks/${subject}/file.json`,
  )
}

test('captures only wrong, gradable answers', () => {
  installMemoryStorage()
  clearMistakes()
  const q = singleChoice(0)

  captureMistake(q, 0, { bankPath: 'practice/banks/生理学/file.json' }) // correct → ignored
  assert.equal(Object.keys(readMistakeBook()).length, 0)

  captureMistake(q, 1, { bankPath: 'practice/banks/生理学/file.json' }) // wrong → captured
  const book = readMistakeBook()
  assert.equal(Object.keys(book).length, 1)
  assert.equal(book[q.id].subject, '生理学')
  assert.equal(book[q.id].wrongCount, 1)
})

test('upsert increments wrongCount and keeps addedAt', () => {
  installMemoryStorage()
  clearMistakes()
  const q = singleChoice(0)
  captureMistake(q, 1, {})
  const first = readMistakeBook()[q.id]
  captureMistake(q, 2, {})
  const second = readMistakeBook()[q.id]
  assert.equal(second.wrongCount, 2)
  assert.equal(second.addedAt, first.addedAt)
})

test('removeMistake deletes by id (auto-remove on correct path)', () => {
  installMemoryStorage()
  clearMistakes()
  const q = singleChoice(0)
  captureMistake(q, 1, {})
  assert.equal(Object.keys(readMistakeBook()).length, 1)
  removeMistake(q.id)
  assert.equal(Object.keys(readMistakeBook()).length, 0)
  // removing a non-existent id is a no-op
  removeMistake('nope')
  assert.equal(Object.keys(readMistakeBook()).length, 0)
})

test('mistakeBookToBank round-trips through the exercise engine', () => {
  installMemoryStorage()
  clearMistakes()
  const q = singleChoice(0)
  captureMistake(q, 1, {})

  const rebuilt = normalizeQuestionBank(mistakeBookToBank(readMistakeBook()), 'mistakes:redo')
  assert.equal(rebuilt.length, 1)
  assert.equal(rebuilt[0].title, 'Q0')
  assert.deepEqual(rebuilt[0].answerIndexes, [0])
  assert.equal(evaluateAnswer(rebuilt[0], 0).correct, true)
  assert.equal(evaluateAnswer(rebuilt[0], 1).correct, false)
})

test('mistakeStats groups by type and subject', () => {
  installMemoryStorage()
  clearMistakes()
  captureMistake(singleChoice(0, { subject: '生理学' }), 1, { bankPath: 'practice/banks/生理学/file.json' })
  captureMistake(singleChoice(1, { subject: '生理学' }), 1, { bankPath: 'practice/banks/生理学/file.json' })
  captureMistake(singleChoice(2, { subject: '解剖学' }), 1, { bankPath: 'practice/banks/解剖学/file.json' })
  const stats = mistakeStats()
  assert.equal(stats.total, 3)
  assert.equal(stats.bySubject['生理学'], 2)
  assert.equal(stats.bySubject['解剖学'], 1)
  assert.equal(stats.byType['单选题'], 3)
})

test('eviction keeps the book under MISTAKE_CAP, dropping lowest wrongCount first', () => {
  installMemoryStorage()
  clearMistakes()
  // Seed CAP entries: one "weak" entry with wrongCount 1, rest with wrongCount 5.
  const seed = {}
  for (let i = 0; i < MISTAKE_CAP; i += 1) {
    const id = `seed-${i}`
    seed[id] = {
      id,
      bankPath: '',
      bankTitle: 'seed',
      reloadable: false,
      subject: '种子',
      type: 'single',
      snapshot: { title: id, type: 'single', typeLabel: '单选题', options: ['a', 'b'], answerText: 'A', answerIndexes: [0], analysis: '' },
      wrongCount: i === 0 ? 1 : 5,
      lastResponse: 1,
      addedAt: 1,
      updatedAt: 1000 + i,
    }
  }
  writeStorage('mistakes:items', seed)

  captureMistake(singleChoice(9999), 1, {}) // pushes over cap
  const book = readMistakeBook()
  assert.equal(Object.keys(book).length, MISTAKE_CAP)
  assert.equal(book['seed-0'], undefined) // weakest evicted
})

test('quota failure triggers eviction and retry', () => {
  // Allow ~3 entries worth of JSON before throwing quota.
  installMemoryStorage(900)
  clearMistakes()
  let captured = 0
  for (let i = 0; i < 40; i += 1) {
    captureMistake(singleChoice(i), 1, {})
    captured += 1
  }
  const book = readMistakeBook()
  // It never grows unbounded: quota forces eviction so the stored size stays small.
  assert.ok(Object.keys(book).length > 0)
  assert.ok(Object.keys(book).length < captured)
})
