import { createRouter, createWebHashHistory } from 'vue-router'

const siteTitle = '医鸣惊人'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: { title: siteTitle },
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/learning',
    name: 'learning',
    meta: { title: `学习资料 - ${siteTitle}` },
    component: () => import('@/pages/LearningPage.vue'),
  },
  {
    path: '/resources',
    name: 'resources',
    meta: { title: `工具资源 - ${siteTitle}` },
    component: () => import('@/pages/ResourcesPage.vue'),
  },
  {
    path: '/practice',
    name: 'practice',
    meta: { title: `在线做题 - ${siteTitle}` },
    component: () => import('@/pages/PracticeHomePage.vue'),
  },
  {
    path: '/practice/exercise',
    name: 'exercise',
    meta: { title: `练习台 - ${siteTitle}` },
    component: () => import('@/pages/ExercisePage.vue'),
  },
  {
    path: '/courses',
    name: 'courses',
    meta: { title: `课程信息 - ${siteTitle}` },
    component: () => import('@/pages/CoursePage.vue'),
  },
  {
    path: '/dream',
    name: 'dream',
    meta: { title: `到梦空间 - ${siteTitle}` },
    component: () => import('@/pages/DreamPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    meta: { title: `页面不存在 - ${siteTitle}` },
    component: () => import('@/pages/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = to.meta.title || siteTitle
})

export default router
