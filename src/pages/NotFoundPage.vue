<template>
  <section class="page-wrap notfound">
    <div class="notfound-card card">
      <span class="notfound-icon">
        <Compass :size="34" />
      </span>
      <h1>页面不存在</h1>
      <p>当前地址没有对应内容，可能链接已失效或输入有误。</p>
      <RouterLink class="button primary" to="/">
        <Home :size="18" />
        返回首页
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { Compass, Home } from '@lucide/vue'
</script>

<style scoped>
.notfound {
  display: grid;
  place-items: center;
  min-height: calc(100vh - 68px - 90px);
}

.notfound-card {
  display: grid;
  justify-items: center;
  gap: 14px;
  max-width: 460px;
  padding: 48px 40px;
  text-align: center;
}

.notfound-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: var(--radius-pill);
  color: var(--brand-strong);
  background: var(--brand-soft);
}

.notfound-card h1 {
  margin: 6px 0 0;
  font-size: 28px;
}

.notfound-card p {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
}

.notfound-card .button {
  margin-top: 6px;
}
</style>
