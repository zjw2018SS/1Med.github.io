<template>
  <section class="page-wrap">
    <div class="empty">
      <h1>页面不存在</h1>
      <p>当前地址没有对应内容。</p>
      <RouterLink class="button primary" to="/">返回首页</RouterLink>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
h1 {
  margin: 0 0 8px;
}

p {
  margin: 0 0 18px;
}
</style>
