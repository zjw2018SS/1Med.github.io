<template>
  <section class="exam-summary card">
    <div class="exam-summary__main">
      <div>
        <strong>{{ summary.scoreRate }}%</strong>
        <span>正确率</span>
      </div>
      <div>
        <strong>{{ correct }}/{{ total }}</strong>
        <span>正确题数</span>
      </div>
      <div>
        <strong>{{ wrong }}</strong>
        <span>错题</span>
      </div>
      <div>
        <strong>{{ summary.referenceCount }}</strong>
        <span>参考题</span>
      </div>
    </div>
    <div class="exam-summary__types">
      <span v-for="item in typeSummary" :key="item.label">{{ item.label }}：{{ item.correct }}/{{ item.total }}</span>
    </div>
    <div class="exam-summary__actions">
      <button class="button" type="button" :disabled="wrong === 0" @click="$emit('show-wrong')">
        <ListFilter :size="18" />
        只看错题
      </button>
      <button class="button danger" type="button" :disabled="wrong === 0" @click="$emit('redo-wrong')">
        <RotateCcw :size="18" />
        重做错题
      </button>
    </div>
  </section>
</template>

<script setup>
import { ListFilter, RotateCcw } from '@lucide/vue'

defineProps({
  summary: { type: Object, required: true },
  typeSummary: { type: Array, default: () => [] },
  correct: { type: Number, default: 0 },
  wrong: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
})

defineEmits(['show-wrong', 'redo-wrong'])
</script>

<style scoped>
.exam-summary {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px 18px;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
}

.exam-summary__main {
  display: grid;
  grid-template-columns: repeat(4, minmax(92px, 1fr));
  gap: 10px;
}

.exam-summary__main div {
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, var(--brand) 16%, var(--line));
  border-radius: var(--radius-sm);
  background: var(--brand-tint);
}

.exam-summary__main div:first-child strong {
  color: var(--brand-strong);
}

.exam-summary__main strong,
.exam-summary__main span,
.exam-summary__types span {
  display: block;
}

.exam-summary__main strong {
  font-size: 24px;
  line-height: 1.1;
}

.exam-summary__main span,
.exam-summary__types {
  color: var(--muted);
  font-size: 13px;
}

.exam-summary__types {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
}

.exam-summary__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

@media (max-width: 960px) {
  .exam-summary {
    grid-template-columns: 1fr;
  }

  .exam-summary__main {
    grid-template-columns: 1fr 1fr;
  }

  .exam-summary__actions {
    justify-content: flex-start;
  }
}
</style>
