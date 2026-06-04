import assert from 'node:assert/strict'
import test from 'node:test'
import { createQuestionBank, normalizeOptionText, parseChoiceAnswerIndexes } from '../../../tools/chaoxing-to-json/src/extractor.js'
import { normalizeQuestionBank } from './exerciseCore.js'

test('normalizes chaoxingRedo generated question bank', () => {
  const bank = createQuestionBank(
    [
      {
        questions: '流行性脑脊髓膜炎的病变性质属于',
        options: ['变质性炎', '渗出性炎', '增生性炎'],
        type: '单选题',
        type_code: 1,
        answers: 'B',
        answers_matching_index: [1],
        analysis: '',
      },
    ],
    { title: '测试题库', id: 'test-id', time: '26年06月01日00小时00分00秒' },
  )

  const normalized = normalizeQuestionBank(bank, 'chaoxingRedo')
  assert.equal(bank.head.filename, '测试题库')
  assert.equal(normalized.length, 1)
  assert.equal(normalized[0].type, 'single')
  assert.deepEqual(normalized[0].answerIndexes, [1])
})

test('cleans learning-platform options and answer letters', () => {
  assert.equal(normalizeOptionText('A. 变质性炎'), '变质性炎')
  assert.equal(normalizeOptionText('（B） 渗出性炎'), '渗出性炎')
  assert.deepEqual(parseChoiceAnswerIndexes('正确答案：AC'), [0, 2])
})
