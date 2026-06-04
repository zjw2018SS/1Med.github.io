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
      <RouterLink v-for="item in featureCards" :key="item.to" class="feature-card card" :to="item.to">
        <component :is="item.icon" :size="26" />
        <div>
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </div>
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
import { BookOpen, ClipboardList, ExternalLink, FileText, GraduationCap, PackageSearch, TableProperties } from '@lucide/vue'
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
  min-height: min(640px, calc(100vh - 68px));
  display: flex;
  align-items: center;
  background-size: cover;
  background-position: center;
  color: #fff;
}

.home-hero__content {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 90px 0 120px;
}

.eyebrow {
  margin: 0 0 12px;
  color: #a9d9c9;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
}

.home-hero h1 {
  margin: 0;
  font-size: clamp(52px, 11vw, 116px);
  line-height: 0.95;
}

.home-hero p {
  max-width: 600px;
  margin: 18px 0 0;
  color: rgba(255, 255, 255, 0.84);
  font-size: clamp(17px, 2.2vw, 22px);
  line-height: 1.65;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.hero-actions .button:not(.primary) {
  color: #fff;
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.32);
}

.home-sections {
  margin-top: -58px;
}

.feature-card {
  min-height: 154px;
  display: flex;
  gap: 14px;
  padding: 20px;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.feature-card svg {
  flex: 0 0 auto;
  color: var(--brand);
}

.feature-card h2,
.quick-panel h2 {
  margin: 0;
  font-size: 20px;
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
  gap: 22px;
  margin-top: 22px;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
}

.quick-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.quick-links a {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 36px;
  padding: 0 11px;
  border: 1px solid var(--line);
  border-radius: 7px;
  color: var(--text-soft);
  background: var(--surface-muted);
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
