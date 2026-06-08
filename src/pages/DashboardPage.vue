<template>
  <section class="page-wrap">
    <div class="page-title">
      <div>
        <h1>学习看板</h1>
        <p>累计做题、正确率趋势与各科掌握度。<small>（自本次更新起统计）</small></p>
      </div>
      <button class="button" type="button" :disabled="!summary.totalDone" @click="reset">
        <Trash2 :size="18" />
        清空统计
      </button>
    </div>

    <div class="metric-cards">
      <div class="metric-card card">
        <strong>{{ summary.totalDone }}</strong>
        <span>累计做题</span>
      </div>
      <div class="metric-card card">
        <strong>{{ summary.accuracy }}%</strong>
        <span>正确率（{{ summary.totalCorrect }}/{{ summary.totalCorrect + summary.totalWrong }}）</span>
      </div>
      <div class="metric-card card">
        <strong>{{ mistakes.total }}</strong>
        <span>错题数</span>
      </div>
      <div class="metric-card card">
        <strong>{{ summary.activeDays }}</strong>
        <span>活跃天数</span>
      </div>
    </div>

    <section class="card panel">
      <div class="panel__head">
        <h2>正确率趋势</h2>
        <div class="segmented-control">
          <button v-for="opt in windowOptions" :key="opt" type="button" :class="{ active: windowDays === opt }" @click="windowDays = opt">
            {{ opt }}天
          </button>
        </div>
      </div>
      <div v-if="!series.length" class="empty">还没有做题记录。</div>
      <div v-else class="trend">
        <div v-for="point in series" :key="point.d" class="trend-col" :title="`${point.d}：${point.c}/${point.n} 正确率 ${point.rate}%`">
          <div class="trend-bar" :style="{ height: `${point.rate}%` }"></div>
        </div>
      </div>
    </section>

    <section class="card panel">
      <h2>各科掌握度</h2>
      <div v-if="!mastery.length" class="empty">做过题的科目会显示在这里。</div>
      <div v-else class="mastery">
        <div v-for="item in mastery" :key="item.subject" class="mastery-row">
          <div class="mastery-row__label">
            <span>{{ item.subject }}</span>
            <span class="mastery-row__num">{{ item.accuracy }}% · {{ item.answered }}/{{ item.total }} 已答</span>
          </div>
          <div class="mastery-bar">
            <div class="mastery-bar__fill" :style="{ width: `${item.accuracy}%` }"></div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="weakSubjects.length" class="card panel">
      <h2>薄弱科目（错题最多）</h2>
      <div class="weak-list">
        <RouterLink v-for="item in weakSubjects" :key="item.subject" class="weak-chip" to="/practice/mistakes">
          {{ item.subject }}
          <span>{{ item.count }}</span>
        </RouterLink>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Trash2 } from '@lucide/vue'
import { readExerciseHistory } from '@/services/exerciseHistoryService'
import { mistakeStats, readMistakeBook } from '@/services/mistakeBookService'
import { clearAttempts, readAttempts, statsSummary, subjectMastery, trendSeries } from '@/services/studyStatsService'

const windowOptions = [7, 30, 180]
const windowDays = ref(30)
const attempts = ref(readAttempts())
const history = ref(readExerciseHistory())
const mistakeBook = ref(readMistakeBook())

const summary = computed(() => statsSummary(attempts.value))
const series = computed(() => trendSeries(windowDays.value, attempts.value))
const mastery = computed(() => subjectMastery(history.value))
const mistakes = computed(() => mistakeStats(mistakeBook.value))
const weakSubjects = computed(() =>
  Object.entries(mistakes.value.bySubject)
    .map(([subject, count]) => ({ subject, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8),
)

function reset() {
  clearAttempts()
  attempts.value = []
}
</script>

<style scoped>
.metric-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.metric-card {
  padding: 18px;
}

.metric-card strong {
  display: block;
  font-size: 30px;
  line-height: 1.1;
  color: var(--brand-strong);
}

.metric-card span {
  display: block;
  margin-top: 6px;
  color: var(--muted);
  font-size: 13px;
}

.panel {
  margin-bottom: 16px;
  padding: 18px;
}

.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.panel h2 {
  margin: 0 0 14px;
  font-size: 18px;
}

.panel__head h2 {
  margin: 0;
}

.segmented-control {
  display: inline-flex;
  height: 36px;
  padding: 3px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--control-bg);
}

.segmented-control button {
  min-width: 52px;
  border: 0;
  border-radius: 5px;
  color: var(--muted);
  background: transparent;
  font-size: 13px;
}

.segmented-control button.active {
  color: var(--brand-contrast);
  background: var(--brand);
}

.trend {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 150px;
  margin-top: 14px;
  padding-top: 6px;
}

.trend-col {
  flex: 1 1 0;
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.trend-bar {
  width: 100%;
  min-height: 2px;
  border-radius: 3px 3px 0 0;
  background: var(--brand-gradient);
  transition: height var(--dur) var(--ease);
}

.mastery {
  display: grid;
  gap: 12px;
}

.mastery-row__label {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
  font-size: 14px;
}

.mastery-row__num {
  color: var(--muted);
  font-size: 13px;
}

.mastery-bar {
  height: 8px;
  border-radius: var(--radius-pill);
  background: var(--surface-soft);
  overflow: hidden;
}

.mastery-bar__fill {
  height: 100%;
  border-radius: inherit;
  background: var(--brand-gradient);
}

.weak-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.weak-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius-pill);
  background: var(--surface-muted);
  color: var(--text-soft);
  font-size: 14px;
}

.weak-chip span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: var(--radius-pill);
  background: var(--rose);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

@media (max-width: 720px) {
  .metric-cards {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
