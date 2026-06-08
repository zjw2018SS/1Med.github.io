import test from 'node:test'
import assert from 'node:assert/strict'

import { matchEntries, normalizeText, tokenize } from './searchCore.js'

test('normalizeText strips CJK spaces, punctuation, and case', () => {
  assert.equal(normalizeText('关 于 生理学'), '关于生理学')
  assert.equal(normalizeText('维生素 B12'), '维生素b12')
  assert.equal(normalizeText('A、B，C。'), 'abc')
  assert.equal(normalizeText(''), '')
})

test('tokenize splits on whitespace and normalizes each token', () => {
  assert.deepEqual(tokenize('生理 学科'), ['生理', '学科'])
  assert.deepEqual(tokenize('  '), [])
})

function records(...titles) {
  return titles.map((t) => ({ norm: normalizeText(t) }))
}

test('matchEntries substring matches with loose normalization', () => {
  const recs = records('关 于 生理学这门学科', '细胞的结构', '生理学的研究方法')
  assert.deepEqual(matchEntries(recs, '关于'), [0])
  assert.deepEqual(matchEntries(recs, '生理学').sort(), [0, 2])
})

test('matchEntries requires all tokens (AND)', () => {
  const recs = records('生理学的研究方法', '生理学这门学科', '细胞结构')
  assert.deepEqual(matchEntries(recs, '生理 方法'), [0])
})

test('matchEntries ranks earlier matches and shorter titles first', () => {
  const recs = records('讲解生理学', '生理学概述更长更长更长', '生理学')
  const ranked = matchEntries(recs, '生理学')
  // entries 1 and 2 both start at position 0; shorter (index 2) comes before longer (index 1); index 0 last.
  assert.deepEqual(ranked, [2, 1, 0])
})

test('matchEntries honors limit and empty query', () => {
  const recs = records('生理学a', '生理学b', '生理学c')
  assert.equal(matchEntries(recs, '生理学', { limit: 2 }).length, 2)
  assert.deepEqual(matchEntries(recs, ''), [])
})
