import { readStorage, removeStorage, writeStorage } from './storageService.js'

const historyKey = 'exercise:history'
const settingsKey = 'exercise:settings'
const defaultSettings = {
  historyLimit: 12,
  autoSubmitSingles: false,
  viewMode: 'all',
  readingSize: 'medium',
}

export function readExerciseSettings() {
  return normalizeSettings(readStorage(settingsKey, {}))
}

export function writeExerciseSettings(settings) {
  return writeStorage(settingsKey, normalizeSettings(settings))
}

export function readExerciseHistory() {
  const rows = readStorage(historyKey, [])
  return Array.isArray(rows) ? rows.filter((item) => item && item.id) : []
}

export function upsertExerciseHistory(entry, limit = defaultSettings.historyLimit) {
  const normalized = normalizeHistoryEntry(entry)
  if (!normalized) return readExerciseHistory()

  const max = normalizeHistoryLimit(limit)
  const rows = readExerciseHistory().filter((item) => item.id !== normalized.id)
  const next = [normalized, ...rows].slice(0, max)
  writeStorage(historyKey, next)
  return next
}

export function removeExerciseHistory(id) {
  const rows = readExerciseHistory().filter((item) => item.id !== id)
  writeStorage(historyKey, rows)
  return rows
}

export function clearExerciseProgress(id) {
  removeStorage(id)
}

export function normalizeHistoryLimit(value) {
  const limit = Number(value)
  if (!Number.isFinite(limit)) return defaultSettings.historyLimit
  return Math.min(Math.max(Math.trunc(limit), 3), 50)
}

function normalizeReadingSize(value) {
  return ['small', 'medium', 'large'].includes(value) ? value : defaultSettings.readingSize
}

function normalizeSettings(settings = {}) {
  const viewMode = settings.viewMode === 'all' ? 'all' : 'single'
  return {
    historyLimit: normalizeHistoryLimit(settings.historyLimit),
    autoSubmitSingles: Boolean(settings.autoSubmitSingles),
    viewMode,
    readingSize: normalizeReadingSize(settings.readingSize),
  }
}

function normalizeHistoryEntry(entry = {}) {
  const id = String(entry.id || entry.progressKey || entry.sourceKey || entry.path || '').trim()
  if (!id) return null

  return {
    id,
    progressKey: entry.progressKey || id,
    sourceKey: entry.sourceKey || '',
    title: entry.title || '未命名题库',
    path: entry.path || '',
    reloadable: Boolean(entry.path),
    total: Number(entry.total || 0),
    answered: Number(entry.answered || 0),
    submitted: Number(entry.submitted || 0),
    correct: Number(entry.correct || 0),
    wrong: Number(entry.wrong || 0),
    favorite: Number(entry.favorite || 0),
    activeIndex: Number(entry.activeIndex || 0),
    updatedAt: entry.updatedAt || Date.now(),
  }
}
