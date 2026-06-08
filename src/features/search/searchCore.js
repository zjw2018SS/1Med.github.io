// Pure, framework-free search matching. Stem-only substring search with loose
// normalization (so "关 于" matches "关于") and multi-token AND.

export function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .replace(/[\s\p{P}]+/gu, '')
    .toLowerCase()
}

export function tokenize(query) {
  return String(query ?? '')
    .trim()
    .split(/\s+/)
    .map(normalizeText)
    .filter(Boolean)
}

// records: array of { norm } (pre-normalized title text). Returns ranked indexes into records.
export function matchEntries(records, query, { limit = 200 } = {}) {
  const tokens = tokenize(query)
  if (!tokens.length) return []

  const hits = []
  for (let i = 0; i < records.length; i += 1) {
    const norm = records[i].norm
    let matched = true
    let firstPos = Infinity
    for (const token of tokens) {
      const pos = norm.indexOf(token)
      if (pos < 0) {
        matched = false
        break
      }
      if (pos < firstPos) firstPos = pos
    }
    if (matched) hits.push({ i, firstPos, len: norm.length })
  }

  hits.sort((a, b) => a.firstPos - b.firstPos || a.len - b.len)
  return hits.slice(0, limit).map((hit) => hit.i)
}
