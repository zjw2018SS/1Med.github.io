<template>
  <div class="exercise-loader card">
    <label class="field">
      <Search :size="17" />
      <select v-model="coursePath" @change="$emit('change-course')">
        <option value="">选择题库目录</option>
        <option v-for="item in catalog" :key="item.id" :value="item.path">{{ item.name }}</option>
      </select>
    </label>
    <label class="field">
      <FileQuestion :size="17" />
      <select v-model="filePath" @change="$emit('change-file')">
        <option value="">选择题库文件</option>
        <option v-for="item in files" :key="item.id" :value="item.path">{{ item.name }}</option>
      </select>
    </label>
    <div class="segmented-control" aria-label="做题视图">
      <button type="button" :class="{ active: viewMode === 'single' }" @click="viewMode = 'single'">单题</button>
      <button type="button" :class="{ active: viewMode === 'all' }" @click="viewMode = 'all'">全部</button>
    </div>

    <details class="loader-popover">
      <summary class="button">
        <Settings2 :size="18" />
        设置
      </summary>
      <div class="loader-popover__panel">
        <label class="popover-field">
          <span><Type :size="16" /> 字号</span>
          <select v-model="readingSize">
            <option value="small">小字号</option>
            <option value="medium">中字号</option>
            <option value="large">大字号</option>
          </select>
        </label>
        <label class="popover-field">
          <span><ListFilter :size="16" /> 导出范围</span>
          <select v-model="exportRange">
            <option value="all">导出全部</option>
            <option value="submitted">导出已提交</option>
            <option value="wrong">导出错题</option>
            <option value="favorites">导出收藏</option>
          </select>
        </label>
        <label class="popover-field">
          <span><FileDown :size="16" /> 导出格式</span>
          <select v-model="exportFormat">
            <option value="json">JSON</option>
            <option value="txt">TXT</option>
            <option value="csv">CSV</option>
          </select>
        </label>
        <label class="popover-field">
          <span><History :size="16" /> 历史上限</span>
          <select v-model.number="historyLimit">
            <option :value="6">保留 6 条</option>
            <option :value="12">保留 12 条</option>
            <option :value="20">保留 20 条</option>
            <option :value="30">保留 30 条</option>
          </select>
        </label>
        <label class="popover-toggle">
          <input v-model="autoSubmitSingles" type="checkbox" />
          单选/判断自动提交
        </label>
      </div>
    </details>

    <details class="loader-popover">
      <summary class="button">
        <Keyboard :size="18" />
        快捷键
      </summary>
      <div class="loader-popover__panel shortcut-panel">
        <div><kbd>←</kbd> <kbd>→</kbd><span>上一题 / 下一题</span></div>
        <div><kbd>Enter</kbd><span>提交并跳下一题</span></div>
        <div><kbd>1</kbd>–<kbd>8</kbd> / <kbd>A</kbd>–<kbd>H</kbd><span>选择选项</span></div>
        <div><kbd>F</kbd><span>收藏当前题</span></div>
        <p>仅在「单题」视图、未聚焦输入框时生效。</p>
      </div>
    </details>

    <span v-if="questionsLength" class="status">可导出 {{ exportRowsLength }} 题</span>
    <span v-if="loadError" class="inline-error">{{ loadError }}</span>
  </div>
</template>

<script setup>
import { FileDown, FileQuestion, History, Keyboard, ListFilter, Search, Settings2, Type } from '@lucide/vue'

defineProps({
  catalog: { type: Array, default: () => [] },
  files: { type: Array, default: () => [] },
  questionsLength: { type: Number, default: 0 },
  exportRowsLength: { type: Number, default: 0 },
  loadError: { type: String, default: '' },
})

defineEmits(['change-course', 'change-file'])

const coursePath = defineModel('coursePath', { type: String, default: '' })
const filePath = defineModel('filePath', { type: String, default: '' })
const viewMode = defineModel('viewMode', { type: String, default: 'all' })
const readingSize = defineModel('readingSize', { type: String, default: 'medium' })
const exportRange = defineModel('exportRange', { type: String, default: 'all' })
const exportFormat = defineModel('exportFormat', { type: String, default: 'json' })
const historyLimit = defineModel('historyLimit', { type: Number, default: 12 })
const autoSubmitSingles = defineModel('autoSubmitSingles', { type: Boolean, default: false })
</script>

<style scoped>
.exercise-loader {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 12px;
  margin-bottom: 16px;
}

.exercise-loader .field {
  flex: 1 1 240px;
}

.loader-popover {
  position: relative;
}

.loader-popover > summary {
  list-style: none;
}

.loader-popover > summary::-webkit-details-marker {
  display: none;
}

.loader-popover__panel {
  position: absolute;
  z-index: 30;
  top: calc(100% + 8px);
  left: 0;
  display: grid;
  gap: 10px;
  min-width: 240px;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface);
  box-shadow: var(--shadow-lg);
}

.popover-field {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: var(--muted);
}

.popover-field > span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.popover-field select {
  min-height: 38px;
  padding: 0 10px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  color: var(--text);
  background: var(--control-bg);
}

.popover-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 4px;
  color: var(--text-soft);
  font-size: 14px;
}

.shortcut-panel > div {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--muted);
}

.shortcut-panel > div span {
  margin-left: auto;
  color: var(--text-soft);
}

.shortcut-panel p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.5;
}

kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border: 1px solid var(--line);
  border-bottom-width: 2px;
  border-radius: 6px;
  background: var(--surface-muted);
  color: var(--text);
  font-size: 12px;
  font-family: inherit;
}

.segmented-control {
  display: inline-flex;
  height: 40px;
  padding: 3px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--control-bg);
}

.segmented-control button {
  min-width: 56px;
  border: 0;
  border-radius: 5px;
  color: var(--muted);
  background: transparent;
}

.segmented-control button.active {
  color: var(--brand-contrast);
  background: var(--brand);
}

.inline-error {
  color: var(--rose);
}
</style>
