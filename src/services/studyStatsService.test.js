import test from 'node:test'
import assert from 'node:assert/strict'

import { clearAttempts, readAttempts, recordAttempt, statsSummary, subjectMastery, trendSeries } from './studyStatsService.js'

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

test('recordAttempt rolls up into a single daily row', () => {
  installMemoryStorage()
  clearAttempts()
  const day = new Date('2026-06-08T00:00:00Z')
  recordAttempt({ correct: true, comparable: true }, day)
  recordAttempt({ correct: false, comparable: true }, day)
  recordAttempt({ correct: false, comparable: false }, day) // short answer: counted, not graded
  const rows = readAttempts()
  assert.equal(rows.length, 1)
  assert.deepEqual(rows[0], { d: '2026-06-08', n: 3, c: 1, w: 1 })
})

test('statsSummary aggregates totals and accuracy over graded answers', () => {
  installMemoryStorage()
  clearAttempts()
  recordAttempt({ correct: true, comparable: true }, new Date('2026-06-07T00:00:00Z'))
  recordAttempt({ correct: false, comparable: true }, new Date('2026-06-08T00:00:00Z'))
  recordAttempt({ correct: true, comparable: true }, new Date('2026-06-08T00:00:00Z'))
  const summary = statsSummary()
  assert.equal(summary.totalDone, 3)
  assert.equal(summary.totalCorrect, 2)
  assert.equal(summary.totalWrong, 1)
  assert.equal(summary.activeDays, 2)
  assert.equal(summary.accuracy, 67)
})

test('retention keeps only the most recent 180 days', () => {
  installMemoryStorage()
  clearAttempts()
  for (let i = 0; i < 200; i += 1) {
    const date = new Date(Date.UTC(2025, 0, 1 + i))
    recordAttempt({ correct: true, comparable: true }, date)
  }
  const rows = readAttempts()
  assert.equal(rows.length, 180)
  // oldest retained is the 21st day (indices 0..19 dropped)
  assert.equal(rows[0].d, new Date(Date.UTC(2025, 0, 21)).toISOString().slice(0, 10))
})

test('trendSeries returns ordered points with per-day rate', () => {
  installMemoryStorage()
  clearAttempts()
  recordAttempt({ correct: true, comparable: true }, new Date('2026-06-07T00:00:00Z'))
  recordAttempt({ correct: false, comparable: true }, new Date('2026-06-08T00:00:00Z'))
  const series = trendSeries(7)
  assert.equal(series.length, 2)
  assert.equal(series[0].rate, 100)
  assert.equal(series[1].rate, 0)
})

test('subjectMastery groups history rows by subject', () => {
  const mastery = subjectMastery([
    { path: 'practice/banks/生理学/a.json', title: '生理学', total: 10, correct: 8, wrong: 2, answered: 10 },
    { path: 'practice/banks/生理学/b.json', title: '生理学', total: 5, correct: 3, wrong: 2, answered: 5 },
    { path: 'practice/banks/解剖学/c.json', title: '解剖学', total: 4, correct: 1, wrong: 3, answered: 4 },
  ])
  assert.equal(mastery.length, 2)
  assert.equal(mastery[0].subject, '生理学')
  assert.equal(mastery[0].total, 15)
  assert.equal(mastery[0].accuracy, 73)
})
