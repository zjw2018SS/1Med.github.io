import fs from 'node:fs'
import path from 'node:path'

import { normalizeQuestionBank } from '../src/features/exercise/exerciseCore.js'

// Builds a compact, stem-only search index over every practice bank, so the site can
// offer global question search without shipping/loading the full 21MB of bank text.
// Output: public/data/search/manifest.json + index-NNN.json chunks.

const dataRoot = path.resolve('public/data')
const practiceRoot = path.join(dataRoot, 'practice')
const outDir = path.join(dataRoot, 'search')
const catalogFile = path.join(practiceRoot, 'catalog.json')

const TITLE_MAX = 120
const CHUNK_SIZE = 8000

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function normalizePracticePath(value) {
  let clean = String(value || '')
    .replace(/\\/g, '/')
    .replace(/^\.?\//, '')
    .replace(/^data\//, '')
  if (!clean.startsWith('practice/')) clean = `practice/banks/${clean}`
  return clean
}

// Mirrors questionBankService.loadQuestionFiles: resolves a bank dir's path_info.json into files.
function filesForBank(bankPath) {
  const infoFile = path.join(dataRoot, `${bankPath.replace(/\/$/, '')}/path_info.json`)
  if (!fs.existsSync(infoFile)) return []
  let rows
  try {
    rows = readJson(infoFile)
  } catch {
    return []
  }
  return rows.flatMap((item, rowIndex) => {
    const paths = Array.isArray(item.path) ? item.path : [item.path]
    return paths.filter(Boolean).map((p) => {
      const normalizedPath = normalizePracticePath(p)
      const fileName = normalizedPath.split('/').pop()?.replace(/\.json$/i, '') || `题库 ${rowIndex + 1}`
      return { path: normalizedPath, name: paths.length > 1 ? fileName : item.name || fileName }
    })
  })
}

const catalog = readJson(catalogFile)
const files = []
const entries = []
let skipped = 0

catalog.forEach((bank) => {
  const bankPath = normalizePracticePath(bank.path)
  const courseName = bank.name || bankPath
  for (const file of filesForBank(bankPath)) {
    const target = path.join(dataRoot, file.path)
    if (!fs.existsSync(target)) {
      skipped += 1
      continue
    }
    let questions
    try {
      questions = normalizeQuestionBank(readJson(target), file.path)
    } catch {
      skipped += 1
      continue
    }
    if (!questions.length) continue
    const fileIndex = files.length
    files.push({ p: file.path, n: file.name, c: courseName })
    questions.forEach((question) => {
      const title = (question.title || '').slice(0, TITLE_MAX)
      if (!title) return
      entries.push([title, question.type, fileIndex, question.index])
    })
  }
})

fs.rmSync(outDir, { recursive: true, force: true })
fs.mkdirSync(outDir, { recursive: true })

const chunks = []
for (let i = 0; i < entries.length; i += CHUNK_SIZE) {
  const slice = entries.slice(i, i + CHUNK_SIZE)
  const fileName = `index-${String(chunks.length).padStart(3, '0')}.json`
  fs.writeFileSync(path.join(outDir, fileName), JSON.stringify(slice))
  chunks.push({ file: fileName, count: slice.length })
}

const manifest = { builtAt: new Date().toISOString(), total: entries.length, files, chunks }
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest))

const totalBytes = chunks.reduce((sum, c) => sum + fs.statSync(path.join(outDir, c.file)).size, 0)
console.log(
  JSON.stringify(
    { banks: catalog.length, files: files.length, questions: entries.length, chunks: chunks.length, skipped, approxKB: Math.round(totalBytes / 1024) },
    null,
    2,
  ),
)
