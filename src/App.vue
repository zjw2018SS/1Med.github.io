<template>
  <div class="app-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/" aria-label="医鸣惊人首页">
        <img :src="logoUrl" alt="" />
        <span>医鸣惊人</span>
      </RouterLink>

      <button class="icon-button nav-toggle" type="button" title="打开导航" @click="menuOpen = !menuOpen">
        <Menu :size="22" />
      </button>

      <nav class="site-nav" :class="{ 'is-open': menuOpen }" @click="menuOpen = false">
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to">
          <component :is="item.icon" :size="18" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="theme-actions">
        <button class="icon-button" type="button" :title="mode === 'dark' ? '切换浅色模式' : '切换黑暗模式'" @click="toggleMode">
          <Sun v-if="mode === 'dark'" :size="18" />
          <Moon v-else :size="18" />
        </button>
        <label class="theme-picker" title="切换主题色">
          <Palette :size="17" />
          <select v-model="accent" @change="persistTheme">
            <option value="green">青绿</option>
            <option value="blue">蓝色</option>
            <option value="purple">紫色</option>
            <option value="amber">琥珀</option>
          </select>
        </label>
      </div>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { BookOpen, ClipboardList, Home, Library, Menu, Moon, PackageSearch, Palette, Sun, TableProperties } from '@lucide/vue'
import { readStorage, writeStorage } from '@/services/storageService'
import logoUrl from '../static/img/favicon.png'

const menuOpen = ref(false)
const savedTheme = readStorage('ui:theme', null)
const systemThemeQuery = window.matchMedia?.('(prefers-color-scheme: dark)')
let shouldPersistTheme = Boolean(savedTheme)
const mode = ref(savedTheme?.mode === 'dark' || savedTheme?.mode === 'light' ? savedTheme.mode : systemThemeQuery?.matches ? 'dark' : 'light')
const accent = ref(['green', 'blue', 'purple', 'amber'].includes(savedTheme?.accent) ? savedTheme.accent : 'green')

const navItems = [
  { to: '/', label: '首页', icon: Home },
  { to: '/learning', label: '学习资料', icon: BookOpen },
  { to: '/practice', label: '在线做题', icon: ClipboardList },
  { to: '/resources', label: '工具资源', icon: PackageSearch },
  { to: '/courses', label: '课程信息', icon: TableProperties },
  { to: '/dream', label: '到梦空间', icon: Library },
]

watch([mode, accent], () => {
  document.documentElement.dataset.mode = mode.value
  document.documentElement.dataset.accent = accent.value
  if (shouldPersistTheme) writeStorage('ui:theme', { mode: mode.value, accent: accent.value })
}, { immediate: true })

if (!savedTheme && systemThemeQuery) {
  systemThemeQuery.addEventListener('change', syncSystemTheme)
}

onBeforeUnmount(() => {
  systemThemeQuery?.removeEventListener('change', syncSystemTheme)
})

function toggleMode() {
  mode.value = mode.value === 'dark' ? 'light' : 'dark'
  persistTheme()
}

function persistTheme() {
  shouldPersistTheme = true
  writeStorage('ui:theme', { mode: mode.value, accent: accent.value })
}

function syncSystemTheme(event) {
  if (shouldPersistTheme) return
  mode.value = event.matches ? 'dark' : 'light'
}
</script>
