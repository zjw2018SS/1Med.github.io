<template>
  <section class="page-wrap">
    <div class="page-title">
      <div>
        <h1>到梦空间</h1>
        <p>第二课堂积分与学分要求。</p>
      </div>
    </div>

    <div class="dream-table card">
      <table>
        <thead>
          <tr>
            <th>模块</th>
            <th v-for="year in years" :key="year">{{ year }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.name">
            <td>{{ row.name }}</td>
            <td v-for="value in row.values" :key="`${row.name}-${value}`">{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
const years = ['第一学年', '第二学年', '第三学年', '第四学年']

const rows = [
  { name: '理想信念与道德修养', values: [7, 6, 6, 3] },
  { name: '学术科技与创新就业', values: [3, 3, 3, 1] },
  { name: '课外阅读与自主学习', values: [5, 3, 3, 2] },
  { name: '社会实践与社会工作', values: [5, 3, 3, 1] },
  { name: '文化艺术与身心发展', values: [6, 3, 3, 2] },
  { name: '志愿服务与公益劳动', values: [4, 2, 2, 1] },
  { name: '应累计积分', values: [30, 20, 20, 10] },
  { name: '应修学分', values: [3, 2, 2, 1] },
]
</script>

<style scoped>
.dream-table {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 680px;
}

th,
td {
  padding: 14px;
  border-bottom: 1px solid var(--line);
  text-align: center;
}

th:first-child,
td:first-child {
  text-align: left;
}

th {
  color: var(--text-soft);
  background: var(--surface-soft);
}
</style>
