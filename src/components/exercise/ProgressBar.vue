<template>
  <div class="exercise-progress card">
    <div class="exercise-progress__track">
      <div class="exercise-progress__fill" :style="{ width: `${percent}%` }"></div>
    </div>
    <div class="exercise-progress__stats">
      <span>已答 <strong>{{ answered }}</strong>/{{ total }}</span>
      <span>已交 <strong>{{ submitted }}</strong></span>
      <span class="ok">正确 <strong>{{ correct }}</strong></span>
      <span v-if="wrong" class="bad">错题 <strong>{{ wrong }}</strong></span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  answered: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  submitted: { type: Number, default: 0 },
  correct: { type: Number, default: 0 },
  wrong: { type: Number, default: 0 },
})

const percent = computed(() => (props.total ? Math.round((props.answered / props.total) * 100) : 0))
</script>

<style scoped>
.exercise-progress {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 14px;
  padding: 14px 18px;
}

.exercise-progress__track {
  flex: 1 1 240px;
  height: 8px;
  border-radius: var(--radius-pill);
  background: var(--surface-soft);
  overflow: hidden;
}

.exercise-progress__fill {
  height: 100%;
  border-radius: inherit;
  background: var(--brand-gradient);
  transition: width var(--dur-slow) var(--ease);
}

.exercise-progress__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  font-size: 13px;
  color: var(--muted);
}

.exercise-progress__stats strong {
  color: var(--text);
  font-size: 15px;
}

.exercise-progress__stats .ok strong {
  color: var(--brand-strong);
}

.exercise-progress__stats .bad strong {
  color: var(--rose);
}
</style>
