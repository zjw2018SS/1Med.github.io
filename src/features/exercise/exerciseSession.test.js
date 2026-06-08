import test from 'node:test'
import assert from 'node:assert/strict'

import {
  answerStatus,
  canAutoSubmit,
  exportRangeLabel,
  isTypingTarget,
  matchesQuestionFilter,
  optionIndexFromShortcut,
  optionLetter,
  parseExtensionPayload,
  progressKey,
  referenceAnswer,
  responseHasValue,
  resultLabelFor,
  safeFileName,
  toggleMultipleOption,
} from './exerciseSession.js'

test('optionLetter maps indexes to A-Z', () => {
  assert.equal(optionLetter(0), 'A')
  assert.equal(optionLetter(7), 'H')
})

test('optionIndexFromShortcut handles digits and letters', () => {
  assert.equal(optionIndexFromShortcut('1'), 0)
  assert.equal(optionIndexFromShortcut('8'), 7)
  assert.equal(optionIndexFromShortcut('9'), null)
  assert.equal(optionIndexFromShortcut('a'), 0)
  assert.equal(optionIndexFromShortcut('H'), 7)
  assert.equal(optionIndexFromShortcut('I'), null)
})

test('isTypingTarget detects editable elements', () => {
  assert.equal(isTypingTarget({ tagName: 'INPUT' }), true)
  assert.equal(isTypingTarget({ tagName: 'TEXTAREA' }), true)
  assert.equal(isTypingTarget({ tagName: 'SELECT' }), true)
  assert.equal(isTypingTarget({ tagName: 'DIV', isContentEditable: true }), true)
  assert.equal(isTypingTarget({ tagName: 'BUTTON' }), false)
  assert.equal(isTypingTarget(null), false)
})

test('responseHasValue treats arrays and trimmed strings', () => {
  assert.equal(responseHasValue([]), false)
  assert.equal(responseHasValue([0]), true)
  assert.equal(responseHasValue(0), true)
  assert.equal(responseHasValue(''), false)
  assert.equal(responseHasValue('  '), false)
  assert.equal(responseHasValue('x'), true)
  assert.equal(responseHasValue(undefined), false)
})

test('toggleMultipleOption adds, removes, and keeps sorted', () => {
  assert.deepEqual(toggleMultipleOption([], 2, true), [2])
  assert.deepEqual(toggleMultipleOption([2], 0, true), [0, 2])
  assert.deepEqual(toggleMultipleOption([0, 2], 2, false), [0])
  assert.deepEqual(toggleMultipleOption([0, 2], 2, true), [0, 2])
})

test('canAutoSubmit only for single/judge with one answer', () => {
  assert.equal(canAutoSubmit({ type: 'single', answerIndexes: [1] }, true), true)
  assert.equal(canAutoSubmit({ type: 'judge', answerIndexes: [0] }, true), true)
  assert.equal(canAutoSubmit({ type: 'single', answerIndexes: [1] }, false), false)
  assert.equal(canAutoSubmit({ type: 'multiple', answerIndexes: [1] }, true), false)
  assert.equal(canAutoSubmit({ type: 'single', answerIndexes: [0, 1] }, true), false)
})

test('answerStatus decision table', () => {
  assert.equal(answerStatus({ submitted: true, result: { correct: true, comparable: true }, answered: true }).key, 'correct')
  assert.equal(answerStatus({ submitted: true, result: { correct: false, comparable: true }, answered: true }).key, 'wrong')
  assert.equal(answerStatus({ submitted: true, result: { correct: false, comparable: false }, answered: true }).key, 'reference')
  assert.equal(answerStatus({ submitted: false, result: { comparable: true }, answered: true }).key, 'answered')
  assert.equal(answerStatus({ submitted: false, result: {}, answered: false }).key, 'unanswered')
})

test('matchesQuestionFilter covers all keys', () => {
  assert.equal(matchesQuestionFilter('all', {}), true)
  assert.equal(matchesQuestionFilter('unanswered', { answered: false }), true)
  assert.equal(matchesQuestionFilter('answered', { answered: true }), true)
  assert.equal(matchesQuestionFilter('wrong', { submitted: true, result: { comparable: true, correct: false } }), true)
  assert.equal(matchesQuestionFilter('wrong', { submitted: true, result: { comparable: true, correct: true } }), false)
  assert.equal(matchesQuestionFilter('favorites', { favorite: true }), true)
  assert.equal(matchesQuestionFilter('favorites', { favorite: false }), false)
})

test('resultLabelFor and referenceAnswer', () => {
  assert.equal(resultLabelFor({ correct: true }), '回答正确')
  assert.equal(resultLabelFor({ comparable: true }), '回答错误')
  assert.equal(resultLabelFor({}), '参考答案')
  assert.equal(referenceAnswer({ answerIndexes: [0, 2], options: ['x', 'y', 'z'] }), 'A. x；C. z')
  assert.equal(referenceAnswer({ answerIndexes: [], options: [], answerText: '自由' }), '自由')
  assert.equal(referenceAnswer({ answerIndexes: [], options: [] }), '暂无参考答案')
})

test('progressKey, exportRangeLabel, safeFileName', () => {
  assert.equal(progressKey('practice/banks/x', 'T'), 'exercise:practice/banks/x')
  assert.equal(progressKey('', 'T'), 'exercise:T')
  assert.equal(exportRangeLabel('wrong'), '错题')
  assert.equal(exportRangeLabel('???'), '导出')
  assert.equal(safeFileName('a/b:c*?'), 'a_b_c__')
})

test('parseExtensionPayload parses strings and objects', () => {
  assert.deepEqual(parseExtensionPayload('[1,2]'), [1, 2])
  assert.deepEqual(parseExtensionPayload({ body: [1] }), { body: [1] })
  assert.deepEqual(parseExtensionPayload([1]), [1])
  assert.equal(parseExtensionPayload('hello'), null)
  assert.equal(parseExtensionPayload(''), null)
  assert.equal(parseExtensionPayload({ nope: true }), null)
})
