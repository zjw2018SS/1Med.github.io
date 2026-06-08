<template>
  <article :id="`question-${question.index + 1}`" class="question-card card" :class="{ active }">
    <div class="question-card__top">
      <span class="status">{{ question.typeLabel }} · {{ statusLabel }}</span>
      <button
        v-if="!hideFavorite"
        class="icon-button"
        type="button"
        :title="isFavorite ? '取消收藏' : '收藏'"
        @click="$emit('toggle-favorite', question.id)"
      >
        <Star v-if="isFavorite" :size="18" fill="currentColor" />
        <StarOff v-else :size="18" />
      </button>
    </div>

    <h2>{{ question.index + 1 }}. {{ question.title }}</h2>

    <div v-if="question.options.length" class="options">
      <label
        v-for="(option, optionIndex) in question.options"
        :key="`${question.id}-${optionIndex}`"
        class="option-row"
        :class="{ selected: isSelected(optionIndex), disabled: reviewMode }"
      >
        <input
          :type="question.type === 'multiple' ? 'checkbox' : 'radio'"
          :name="question.id"
          :checked="isSelected(optionIndex)"
          :disabled="reviewMode"
          @change="$emit('select-option', question, optionIndex, $event.target.checked)"
        />
        <span class="option-letter">{{ optionLetter(optionIndex) }}</span>
        <span>{{ option }}</span>
      </label>
    </div>

    <textarea
      v-else
      class="answer-textarea"
      :value="response || ''"
      :disabled="reviewMode"
      placeholder="输入你的答案"
      @input="$emit('set-text', question, $event.target.value)"
    />

    <div v-if="!reviewMode" class="question-toolbar">
      <button v-if="viewMode === 'single'" class="button" type="button" :disabled="previousIndex == null" @click="$emit('go-to-index', previousIndex)">
        <ChevronLeft :size="18" />
        上一题
      </button>
      <button class="button primary" type="button" @click="$emit('submit', question)">
        <CheckCircle2 :size="18" />
        提交
      </button>
      <button v-if="viewMode === 'single'" class="button" type="button" :disabled="nextIndex == null" @click="$emit('go-to-index', nextIndex)">
        下一题
        <ChevronRight :size="18" />
      </button>
    </div>

    <div v-if="showAnswer" class="answer-panel" :class="{ correct: result.correct, wrong: !result.correct && result.comparable }">
      <div class="answer-panel__status">
        <CheckCircle2 v-if="result.correct" :size="19" />
        <XCircle v-else-if="result.comparable" :size="19" />
        <ListChecks v-else :size="19" />
        <strong>{{ resultLabelFor(result) }}</strong>
      </div>
      <p><span>你的答案：</span>{{ responseToText(question, response) || '未作答' }}</p>
      <p><span>参考答案：</span>{{ referenceAnswer(question) }}</p>
      <p v-if="question.analysis"><span>解析：</span>{{ question.analysis }}</p>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { CheckCircle2, ChevronLeft, ChevronRight, ListChecks, Star, StarOff, XCircle } from '@lucide/vue'
import { responseToText } from '@/features/exercise/exerciseCore'
import { answerStatus, optionLetter, referenceAnswer, responseHasValue, resultLabelFor } from '@/features/exercise/exerciseSession'

const props = defineProps({
  question: { type: Object, required: true },
  response: { type: [String, Number, Array], default: '' },
  submitted: { type: Boolean, default: false },
  result: { type: Object, default: () => ({}) },
  isFavorite: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  viewMode: { type: String, default: 'all' },
  previousIndex: { type: Number, default: null },
  nextIndex: { type: Number, default: null },
  reviewMode: { type: Boolean, default: false },
  hideFavorite: { type: Boolean, default: false },
})

defineEmits(['select-option', 'set-text', 'submit', 'toggle-favorite', 'go-to-index'])

const showAnswer = computed(() => props.reviewMode || props.submitted)
const statusLabel = computed(() =>
  answerStatus({ submitted: props.submitted, result: props.result, answered: responseHasValue(props.response) }).label,
)

function isSelected(optionIndex) {
  return Array.isArray(props.response) ? props.response.includes(optionIndex) : props.response === optionIndex
}
</script>

<style scoped>
.question-card {
  scroll-margin-top: 86px;
  padding: 24px;
  font-size: var(--exercise-body-size);
}

.question-card.active {
  border-color: color-mix(in srgb, var(--brand) 42%, var(--line));
}

.question-card__top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.question-card h2 {
  margin: 0 0 22px;
  font-size: var(--exercise-title-size);
  line-height: 1.45;
}

.options {
  display: grid;
  gap: 10px;
}

.option-row {
  display: grid;
  grid-template-columns: 20px 32px 1fr;
  align-items: start;
  gap: 10px;
  min-height: 48px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--surface);
  line-height: 1.6;
  cursor: pointer;
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
}

.option-row:hover {
  border-color: color-mix(in srgb, var(--brand) 35%, var(--line));
  background: var(--hover-surface);
}

.option-row.selected {
  border-color: color-mix(in srgb, var(--brand) 55%, var(--line));
  background: var(--surface-soft);
}

.option-row.disabled {
  cursor: default;
}

.option-letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-pill);
  color: var(--brand-strong);
  background: var(--surface-soft);
  font-weight: 800;
  transition: color var(--dur) var(--ease), background var(--dur) var(--ease);
}

.option-row.selected .option-letter {
  color: var(--brand-contrast);
  background: var(--brand);
}

.answer-textarea {
  width: 100%;
  min-height: 150px;
  padding: 13px;
  border: 1px solid var(--line);
  border-radius: 7px;
  color: var(--text);
  background: var(--surface);
  resize: vertical;
}

.question-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.answer-panel {
  margin-top: 18px;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--surface-muted);
}

.answer-panel.correct {
  border-color: rgba(36, 122, 99, 0.32);
  background: color-mix(in srgb, var(--brand) 10%, var(--surface));
}

.answer-panel.wrong {
  border-color: rgba(189, 74, 90, 0.28);
  background: color-mix(in srgb, var(--rose) 10%, var(--surface));
}

.answer-panel__status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.answer-panel p {
  margin: 8px 0 0;
  line-height: 1.65;
}

.answer-panel span {
  color: var(--muted);
}
</style>
