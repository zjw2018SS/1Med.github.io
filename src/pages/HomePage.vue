<template>
  <section class="home-hero" :style="{ backgroundImage: `linear-gradient(90deg, rgba(10, 22, 19, 0.82), rgba(10, 22, 19, 0.2)), url(${heroImage})` }">
    <div class="home-hero__content">
      <p class="eyebrow">Medical Learning Workspace</p>
      <h1>医鸣惊人</h1>
      <p>医学资料、在线题库、课程信息和本站工具集中在一个清晰入口。</p>
      <div class="hero-actions">
        <RouterLink class="button primary" to="/practice">
          <ClipboardList :size="18" />
          开始做题
        </RouterLink>
        <RouterLink class="button" to="/learning">
          <BookOpen :size="18" />
          查学习资料
        </RouterLink>
      </div>
    </div>
  </section>

  <section class="page-wrap home-sections">
    <div class="grid three">
      <RouterLink v-for="item in featureCards" :key="item.to" class="feature-card card interactive" :to="item.to">
        <span class="feature-card__icon">
          <component :is="item.icon" :size="24" />
        </span>
        <div class="feature-card__body">
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </div>
        <ArrowRight class="feature-card__arrow" :size="18" />
      </RouterLink>
    </div>

    <div class="quick-panel">
      <div>
        <h2>常用入口</h2>
        <p>保留原项目里高频访问的学校系统和资料入口。</p>
      </div>
      <div class="quick-links">
        <a v-for="item in quickLinks" :key="item.href" :href="item.href" target="_blank" rel="noopener noreferrer">
          <ExternalLink :size="16" />
          {{ item.label }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { BookOpen, ClipboardList, ExternalLink, FileText, GraduationCap, PackageSearch, TableProperties, ArrowRight } from '@lucide/vue'
import { loadQuickLinks } from '@/services/homeService'
import heroImage from '../../static/img/index/min-size/mmexport1728296049053.jpg'

const quickLinks = ref([])

const featureCards = [
  {
    to: '/learning',
    title: '学习资料',
    description: '课程资料、题库 PDF、笔记和网课链接集中检索。',
    icon: BookOpen,
  },
  {
    to: '/practice',
    title: '在线做题',
    description: '读取统一 JSON 题库，支持导入、答题、判题和收藏。',
    icon: ClipboardList,
  },
  {
    to: '/resources',
    title: '工具资源',
    description: '题库生产、格式转换和站内维护工具。',
    icon: PackageSearch,
  },
  {
    to: '/courses',
    title: '课程信息',
    description: '按学期、课程性质和学分查看培养方案。',
    icon: TableProperties,
  },
  {
    to: '/dream',
    title: '到梦空间',
    description: '查看第二课堂积分和学分要求。',
    icon: GraduationCap,
  },
  {
    to: '/learning',
    title: '资料文件',
    description: '保留 PDF、DOCX 等原始资料文件访问能力。',
    icon: FileText,
  },
]

onMounted(async () => {
  quickLinks.value = await loadQuickLinks()
})
</script>

<style scoped>
.home-hero {
  position: relative;
  min-height: min(640px, calc(100vh - 68px));
  display: flex;
  align-items: center;
  background-size: cover;
  background-position: center;
  color: #fff;
  isolation: isolate;
}

.home-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(120% 80% at 12% 50%, color-mix(in srgb, var(--brand) 55%, transparent), transparent 60%);
  mix-blend-mode: screen;
  opacity: 0.65;
}

.home-hero__content {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 90px 0 120px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  margin: 0 0 16px;
  padding: 5px 12px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #d7f1e8;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  backdrop-filter: blur(6px);
}

.home-hero h1 {
  margin: 0;
  font-size: clamp(52px, 11vw, 116px);
  line-height: 0.95;
  letter-spacing: -0.03em;
  text-shadow: 0 8px 40px rgba(0, 0, 0, 0.35);
}

.home-hero p {
  max-width: 600px;
  margin: 18px 0 0;
  color: rgba(255, 255, 255, 0.86);
  font-size: clamp(17px, 2.2vw, 22px);
  line-height: 1.65;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.hero-actions .button {
  min-height: 46px;
  padding: 0 22px;
}

.hero-actions .button:not(.primary) {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.34);
  backdrop-filter: blur(6px);
}

.hero-actions .button:not(.primary):hover {
  background: rgba(255, 255, 255, 0.2);
}

.home-sections {
  margin-top: -58px;
}

.feature-card {
  position: relative;
  min-height: 154px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 22px;
}

.feature-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 46px;
  height: 46px;
  border-radius: var(--radius-md);
  color: var(--brand-strong);
  background: var(--brand-soft);
}

.feature-card__body {
  min-width: 0;
}

.feature-card__arrow {
  position: absolute;
  top: 22px;
  right: 20px;
  color: var(--muted);
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease), color var(--dur) var(--ease);
}

.feature-card:hover .feature-card__arrow {
  opacity: 1;
  transform: translateX(0);
  color: var(--brand);
}

.feature-card h2,
.quick-panel h2 {
  margin: 0;
  font-size: 20px;
  letter-spacing: -0.01em;
}

.feature-card p,
.quick-panel p {
  margin: 8px 0 0;
  color: var(--muted);
  line-height: 1.6;
}

.quick-panel {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  margin-top: 24px;
  padding: 26px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(135deg, var(--brand-tint), transparent 60%),
    var(--surface);
  box-shadow: var(--shadow-sm);
}

.quick-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-content: flex-start;
}

.quick-links a {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 38px;
  padding: 0 13px;
  border: 1px solid var(--line);
  border-radius: var(--radius-pill);
  color: var(--text-soft);
  background: var(--surface);
  transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease), background var(--dur) var(--ease);
}

.quick-links a:hover {
  color: var(--brand-strong);
  border-color: color-mix(in srgb, var(--brand) 40%, var(--line));
  background: var(--brand-soft);
}

.quick-links svg {
  color: var(--muted);
}

@media (max-width: 860px) {
  .home-hero {
    min-height: 560px;
  }

  .home-sections {
    margin-top: -36px;
  }

  .quick-panel {
    grid-template-columns: 1fr;
  }
}
</style>
