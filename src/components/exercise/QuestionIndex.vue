<template>
  <aside class="question-index card" :class="{ 'is-open': open }">
    <div class="question-index__top">
      <strong>题号</strong>
      <button class="icon-button" type="button" title="关闭题号抽屉" @click="$emit('close')">
        <XCircle :size="18" />
      </button>
    </div>
    <div class="metrics">
      <div class="metric">
        <strong>{{ metrics.total }}</strong>
        <span>题目</span>
      </div>
      <div class="metric">
        <strong>{{ metrics.answered }}</strong>
        <span>已答</span>
      </div>
      <div class="metric">
        <strong>{{ metrics.submitted }}</strong>
        <span>已交</span>
      </div>
      <div class="metric">
        <strong>{{ metrics.correct }}</strong>
        <span>正确</span>
      </div>
    </div>
    <div class="index-filter" aria-label="题号筛选">
      <button
        v-for="filter in filters"
        :key="filter.key"
        type="button"
        :class="{ active: activeFilter === filter.key }"
        @click="$emit('set-filter', filter.key)"
      >
        {{ filter.label }}
      </button>
    </div>
    <div class="question-buttons">
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        :class="item.classes"
        :title="`第 ${item.index + 1} 题：${item.label}`"
        @click="$emit('go-to', item.question)"
      >
        <span>{{ item.index + 1 }}</span>
        <small>{{ item.short }}</small>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { XCircle } from '@lucide/vue'

defineProps({
  open: { type: Boolean, default: false },
  metrics: { type: Object, required: true },
  filters: { type: Array, default: () => [] },
  activeFilter: { type: String, default: 'all' },
  items: { type: Array, default: () => [] },
})

defineEmits(['close', 'go-to', 'set-filter'])
</script>

<style scoped>
.question-index {
  align-self: start;
  position: sticky;
  top: 86px;
  max-height: calc(100vh - 104px);
  overflow: auto;
  padding: 12px;
}

.question-index__top {
  display: none;
}

.metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.metrics .metric {
  padding: 12px;
  background: var(--surface-muted);
  border-radius: 7px;
}

.index-filter {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6px;
  margin: 12px 0;
}

.index-filter button {
  min-height: 34px;
  padding: 0 6px;
  border: 1px solid var(--line);
  border-radius: 7px;
  color: var(--text-soft);
  background: var(--control-bg);
  font-size: 13px;
}

.index-filter button.active {
  border-color: var(--brand);
  color: var(--brand-contrast);
  background: var(--brand);
}

.question-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
  gap: 7px;
}

.question-buttons button {
  display: grid;
  place-items: center;
  gap: 1px;
  min-height: 44px;
  border: 1px solid var(--line);
  border-radius: 7px;
  color: var(--text);
  background: var(--surface);
}

.question-buttons small {
  color: var(--muted);
  font-size: 11px;
  line-height: 1;
}

.question-buttons button.active {
  border-color: var(--brand);
  color: var(--brand-contrast);
  background: var(--brand);
}

.question-buttons button.active small {
  color: color-mix(in srgb, var(--brand-contrast) 78%, transparent);
}

.question-buttons button.answered {
  border-color: rgba(47, 111, 189, 0.4);
  background: color-mix(in srgb, var(--blue) 10%, var(--surface));
}

.question-buttons button.done {
  border-color: rgba(47, 111, 189, 0.35);
}

.question-buttons button.correct {
  border-color: rgba(36, 122, 99, 0.38);
  background: color-mix(in srgb, var(--brand) 13%, var(--surface));
}

.question-buttons button.wrong {
  border-color: rgba(189, 74, 90, 0.38);
  background: color-mix(in srgb, var(--rose) 12%, var(--surface));
}

.question-buttons button.reference {
  background: var(--surface-muted);
}

.question-buttons button.favorite {
  box-shadow: inset 0 -3px 0 var(--amber);
}

@media (max-width: 960px) {
  .question-index {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 39;
    max-height: min(72vh, 620px);
    padding: 14px;
    overflow: auto;
    border-radius: 14px 14px 0 0;
    box-shadow: var(--shadow);
    transform: translateY(calc(100% + 18px));
    transition: transform 180ms ease;
  }

  .question-index.is-open {
    transform: translateY(0);
  }

  .question-index__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
  }
}
</style>
