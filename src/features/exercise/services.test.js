import test from 'node:test'
import assert from 'node:assert/strict'

import { normalizePracticePath } from '../../services/questionBankService.js'
import { readExerciseHistory, upsertExerciseHistory } from '../../services/exerciseHistoryService.js'

function installMemoryStorage() {
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
      values.set(key, String(value))
    },
  }
}

test('normalizes practice paths for data-root loading', () => {
  assert.equal(normalizePracticePath('practice/banks/course/a.json'), 'practice/banks/course/a.json')
  assert.equal(normalizePracticePath('data/practice/banks/course/a.json'), 'practice/banks/course/a.json')
  assert.equal(normalizePracticePath('./course/a.json'), 'practice/banks/course/a.json')
  assert.equal(normalizePracticePath('course\\a.json'), 'practice/banks/course/a.json')
})

test('upserts, deduplicates, and trims exercise history', () => {
  installMemoryStorage()
  localStorage.clear()

  upsertExerciseHistory({ id: 'a', title: 'A', path: 'a.json', updatedAt: 1 }, 3)
  upsertExerciseHistory({ id: 'b', title: 'B', path: 'b.json', updatedAt: 2 }, 3)
  upsertExerciseHistory({ id: 'c', title: 'C', path: 'c.json', updatedAt: 3 }, 3)
  upsertExerciseHistory({ id: 'a', title: 'A updated', path: 'a.json', updatedAt: 4 }, 3)
  upsertExerciseHistory({ id: 'd', title: 'D', path: 'd.json', updatedAt: 5 }, 3)

  const history = readExerciseHistory()
  assert.deepEqual(
    history.map((item) => item.id),
    ['d', 'a', 'c'],
  )
  assert.equal(history[1].title, 'A updated')
  assert.equal(new Set(history.map((item) => item.id)).size, history.length)
})
