import { dataPath, fetchJson } from './assetService.js'

export async function loadQuestionCatalog() {
  const rows = await fetchJson(dataPath('practice/catalog.json'))
  return rows.map((item, index) => ({
    id: `bank-${index}`,
    name: item.name || `题库 ${index + 1}`,
    path: normalizePracticePath(item.path),
  }))
}

export async function loadQuestionFiles(coursePath) {
  if (!coursePath) return []
  const rows = await fetchJson(dataPath(`${normalizePracticePath(coursePath).replace(/\/$/, '')}/path_info.json`))
  return rows.flatMap((item, rowIndex) => {
    const paths = Array.isArray(item.path) ? item.path : [item.path]
    return paths.filter(Boolean).map((path, pathIndex) => {
      const normalizedPath = normalizePracticePath(path)
      const fileName = normalizedPath.split('/').pop()?.replace(/\.json$/i, '') || `题库 ${rowIndex + 1}`
      return {
        id: `file-${rowIndex}-${pathIndex}`,
        name: paths.length > 1 ? fileName : item.name || fileName,
        path: normalizedPath,
      }
    })
  })
}

export async function loadQuestionBank(filePath) {
  return fetchJson(dataPath(normalizePracticePath(filePath)))
}

export function normalizePracticePath(path) {
  let clean = String(path || '').replace(/\\/g, '/').replace(/^\.?\//, '').replace(/^data\//, '')
  if (!clean.startsWith('practice/')) clean = `practice/banks/${clean}`
  return clean
}

// Subject = the top-level folder under practice/banks (e.g. "大一上 临床医学导论").
// Shared by the mistake notebook, search index builder, and dashboard.
export function subjectFromBankPath(path) {
  const clean = normalizePracticePath(path).replace(/^practice\/banks\//, '')
  const top = clean.split('/').filter(Boolean)[0] || ''
  return top.replace(/^-ign/, '').trim()
}
