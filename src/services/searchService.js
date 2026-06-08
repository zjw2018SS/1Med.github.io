import { dataPath, fetchJson } from './assetService.js'
import { matchEntries, normalizeText } from '../features/search/searchCore.js'

let indexPromise = null

// Loads the build-time search index once per session (manifest + chunks), memoized.
export function loadSearchIndex() {
  if (indexPromise) return indexPromise
  indexPromise = (async () => {
    const manifest = await fetchJson(dataPath('search/manifest.json'))
    const chunks = await Promise.all(manifest.chunks.map((chunk) => fetchJson(dataPath(`search/${chunk.file}`))))
    const entries = chunks.flat()
    const records = entries.map(([title]) => ({ norm: normalizeText(title) }))
    return { files: manifest.files, entries, records, total: manifest.total }
  })()
  return indexPromise
}

export async function search(query, limit = 200) {
  const { files, entries, records } = await loadSearchIndex()
  return matchEntries(records, query, { limit }).map((i) => {
    const [title, type, fileIndex, questionIndex] = entries[i]
    return { title, type, questionIndex, file: files[fileIndex] }
  })
}
