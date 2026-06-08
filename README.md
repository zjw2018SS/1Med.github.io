# 医鸣惊人

面向医学生的学习资料、在线题库、课程信息和工具资源导航平台。

## 技术栈

- Vue 3
- Vite
- Vue Router
- Pinia
- Node.js 内置测试 runner

## 开发命令

```bash
npm install
npm run dev
npm test
npm run build
npm run preview
npm run chaoxing:dev
npm run chaoxing:hmr
npm run chaoxing:build
```

开发服务默认监听 `0.0.0.0:5173`。同一局域网手机访问时，优先使用本机真实网卡地址，例如 `http://192.168.x.x:5173/`。

`npm run chaoxing:dev` 会先构建完整的本地 `chaoxingRedo.user.js`，再启动 Vite 并打开安装地址，适合本地安装测试。`npm run chaoxing:hmr` 才是 `vite-plugin-monkey` 的热更新调试入口；它会安装一个依赖本地 Vite 模块注入的 `dev:` 脚本，在学习通页面可能被 CSP 或浏览器安全策略拦截，不建议当作本地正式安装方式。

`npm run build` 会先同步工具依赖，再构建 chaoxingRedo 油猴脚本，接着生成全站搜题索引（`scripts/build-search-index.mjs` → `public/data/search/`），然后执行 Vite 构建，最后运行 `node scripts/sync-static-assets.mjs`。`public/data` 会由 Vite 自动复制到 `dist/data`（含搜题索引），脚本只补充同步历史静态资源：

- `static/` -> `dist/static/`
- `img/` -> `dist/img/`
- `tools/` -> `dist/tools/`，但不复制工具内部的 `node_modules/`、`build/`、`dev/`、`src/`、`test/` 等开发文件
- `favicon.ico` -> `dist/favicon.ico`
- `CNAME` -> `dist/CNAME`

## 应用结构

```txt
src/
  App.vue
  main.js
  router/
  pages/
  components/
    exercise/
  services/
  stores/
  styles/
  features/
    exercise/
    search/

public/
  data/
    home/
    learning/
    practice/
    resources/
    courses/
    search/        # 由 npm run build / search:build 生成（已 gitignore）

tools/
  chaoxing-to-json/
  json-export-tool/
```

主要页面：

- `#/` 首页
- `#/learning` 学习资料
- `#/practice` 题库目录
- `#/practice/exercise` 练习台
- `#/practice/mistakes` 错题本（跨题库持久化）
- `#/practice/search` 全站搜题
- `#/dashboard` 学习看板
- `#/resources` 工具资源
- `#/courses` 课程信息
- `#/dream` 到梦空间

项目已经按新项目方式重构，不再保留 `习题` 目录；可复用的旧工具统一放在 `tools/` 下维护。

## 做题系统

做题台已从单一大组件拆分为「纯逻辑 + 组合式函数 + 子组件」三层，行为保持不变：

- `src/features/exercise/exerciseCore.js`：题库标准化、答案判断、乱序、答案展示（纯函数，含测试）。
- `src/features/exercise/exerciseSession.js`：从页面抽出的纯逻辑（题号状态、筛选、快捷键解析、扩展载荷解析等），含测试。
- `src/features/exercise/useExerciseSession.js` / `useExerciseKeyboard.js` / `useExtensionReceiver.js` / `useExerciseExport.js`：会话状态与持久化、键盘快捷键、chaoxingRedo 接收、导出。`useExerciseSession` 暴露 `onSubmit` 钩子，错题本与学习统计都挂在此。
- `src/components/exercise/`：`QuestionCard` / `QuestionIndex` / `ProgressBar` / `ExamSummary` / `ExerciseToolbar` / `HistoryPanel`。
- `src/pages/ExercisePage.vue`：薄装配层（题库选择、本地 JSON 导入、路由分发、组件编排）。
- `src/services/exerciseHistoryService.js`：历史记录和做题设置。历史只保存路径、答案和统计信息，不复制完整题库。

### 错题本 / 搜题 / 看板

- `src/services/mistakeBookService.js`：跨题库错题本。做错自动收集（题目快照自包含、稳定 id 去重），做对自动移除；上限 800 条并在配额不足时优雅降级。`#/practice/mistakes` 支持筛选、移除、一键重做（复用做题引擎）。
- `scripts/build-search-index.mjs` + `src/features/search/searchCore.js` + `src/services/searchService.js`：构建期生成精简「题干」索引（`public/data/search/`，分片 + manifest），运行时首次搜索懒加载并被 PWA 缓存。`#/practice/search` 按题干关键词检索并深链到对应题库。
- `src/services/studyStatsService.js`：每日 rollup 学习统计（保留 180 天）。`#/dashboard` 展示累计做题、正确率趋势、各科掌握度与薄弱科目；趋势用纯 CSS 绘制，无图表依赖。

进度保存使用 localStorage，命名空间为 `1med:v2`（错题本 `mistakes:items`、统计 `stats:attempts`）。

## 内容维护

以后增删改内容统一维护 `public/data`：

- 首页快捷入口：`public/data/home/quick-links.json`
- 学习资料：`public/data/learning/courses.json`
- 在线做题目录：`public/data/practice/catalog.json`
- 在线做题题库：`public/data/practice/banks/**/path_info.json` 和同目录下的题库 JSON
- 工具资源：`public/data/resources/resources.json`
- 课程信息：`public/data/courses/course-info.json`

修改 JSON 后，开发模式会直接从 `public/data` 读取；生产发布前运行 `npm run build` 即可把数据打包到 `dist/data`。

## 数据处理工具

题库生产工具统一维护在 `tools/`：

- 工具总入口：`tools/index.html`
- chaoxingRedo 学习通油猴脚本：`tools/chaoxing-to-json/`，用户安装页为 GreasyFork
- JSON 题库生成：`tools/json-export-tool/`
- 社会学统计题转换：`tools/json-export-tool/tool/society.html`

这些工具通过静态页面单独运行，也会随 `npm run build` 发布到 `dist/tools`。工具不再保留旧项目路径，兼容性只保留在输出内容上：生成的题库 JSON 应能被新版做题页导入、预览和作答。chaoxingRedo 通过 `vite-plugin-monkey` 输出可发布的 `.user.js`，并通过 `#/practice/exercise?extension` 与新版做题页通信。
