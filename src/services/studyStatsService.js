import { readStorage, writeStorage } from './storageService.js'
import { subjectFromBankPath } from './questionBankService.js'

const ATTEMPTS_KEY = 'stats:attempts'
const RETENTION_DAYS = 180

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

export function readAttempts() {
  const rows = readStorage(ATTEMPTS_KEY, [])
  return Array.isArray(rows) ? rows.filter((row) => row && row.d) : []
}

// Records one graded submission into today's daily rollup. Daily aggregation keeps the
// log tiny (~40 bytes/day); only the last RETENTION_DAYS are kept.
export function recordAttempt({ correct, comparable } = {}, date = new Date()) {
  const day = todayKey(date)
  const rows = readAttempts()
  let entry = rows.find((row) => row.d === day)
  if (!entry) {
    entry = { d: day, n: 0, c: 0, w: 0 }
    rows.push(entry)
  }
  entry.n += 1
  if (correct) entry.c += 1
  else if (comparable) entry.w += 1

  rows.sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : 0))
  const trimmed = rows.slice(Math.max(0, rows.length - RETENTION_DAYS))
  writeStorage(ATTEMPTS_KEY, trimmed)
  return trimmed
}

export function clearAttempts() {
  writeStorage(ATTEMPTS_KEY, [])
  return []
}

export function statsSummary(rows = readAttempts()) {
  const totalDone = rows.reduce((sum, row) => sum + row.n, 0)
  const totalCorrect = rows.reduce((sum, row) => sum + row.c, 0)
  const totalWrong = rows.reduce((sum, row) => sum + row.w, 0)
  const graded = totalCorrect + totalWrong
  return {
    totalDone,
    totalCorrect,
    totalWrong,
    activeDays: rows.length,
    accuracy: graded ? Math.round((totalCorrect / graded) * 100) : 0,
  }
}

// Last `days` daily points, oldest→newest, each with an accuracy rate over graded answers.
export function trendSeries(days = 30, rows = readAttempts()) {
  return rows.slice(Math.max(0, rows.length - days)).map((row) => {
    const graded = row.c + row.w
    return { d: row.d, n: row.n, c: row.c, w: row.w, rate: graded ? Math.round((row.c / graded) * 100) : 0 }
  })
}

// Per-subject mastery derived from exercise history rows (current-state snapshot per bank).
export function subjectMastery(historyRows = []) {
  const groups = new Map()
  historyRows.forEach((row) => {
    const subject = subjectFromBankPath(row.path) || row.title || '未分类'
    const current = groups.get(subject) || { subject, total: 0, correct: 0, wrong: 0, answered: 0 }
    current.total += Number(row.total || 0)
    current.correct += Number(row.correct || 0)
    current.wrong += Number(row.wrong || 0)
    current.answered += Number(row.answered || 0)
    groups.set(subject, current)
  })
  return [...groups.values()]
    .map((item) => {
      const graded = item.correct + item.wrong
      return { ...item, accuracy: graded ? Math.round((item.correct / graded) * 100) : 0 }
    })
    .sort((a, b) => b.total - a.total)
}
