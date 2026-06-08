<template>
  <details v-if="history.length" class="history-panel card">
    <summary class="history-summary">
      <span>
        <History :size="18" />
        <strong>历史记录</strong>
        <small>{{ history.length }} 条，展开后可继续、重做或删除</small>
      </span>
      <span class="status">最多 {{ historyLimit }} 条</span>
    </summary>
    <div class="history-list">
      <div v-for="entry in history" :key="entry.id" class="history-row">
        <div>
          <strong>{{ entry.title }}</strong>
          <span>{{ entry.answered }}/{{ entry.total }} 已答 · {{ entry.submitted }} 已交 · {{ entry.wrong }} 错 · {{ new Date(entry.updatedAt).toLocaleString() }}</span>
        </div>
        <div class="history-actions">
          <button class="button" type="button" :disabled="!entry.reloadable" @click="$emit('resume', entry, false)">继续</button>
          <button class="button" type="button" :disabled="!entry.reloadable" @click="$emit('resume', entry, true)">重做</button>
          <button class="icon-button" type="button" title="删除记录" @click="$emit('remove', entry)">
            <XCircle :size="17" />
          </button>
        </div>
      </div>
    </div>
  </details>
</template>

<script setup>
import { History, XCircle } from '@lucide/vue'

defineProps({
  history: { type: Array, default: () => [] },
  historyLimit: { type: Number, default: 12 },
})

defineEmits(['resume', 'remove'])
</script>

<style scoped>
.history-panel {
  margin-bottom: 16px;
  padding: 0;
  overflow: hidden;
}

.history-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  min-height: 54px;
  padding: 0 16px;
  cursor: pointer;
  list-style: none;
}

.history-summary::-webkit-details-marker {
  display: none;
}

.history-summary > span:first-child {
  display: flex;
  align-items: center;
  gap: 8px;
}

.history-summary strong {
  font-size: 16px;
}

.history-summary small {
  color: var(--muted);
  font-size: 13px;
}

.history-list {
  display: grid;
  gap: 8px;
  max-height: 260px;
  overflow: auto;
  padding: 0 16px 16px;
}

.history-row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--surface-muted);
}

.history-row strong,
.history-row span {
  display: block;
}

.history-row span {
  margin-top: 4px;
  color: var(--muted);
  font-size: 13px;
}

.history-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

@media (max-width: 960px) {
  .history-row {
    grid-template-columns: 1fr;
  }

  .history-actions {
    justify-content: flex-start;
  }
}
</style>
