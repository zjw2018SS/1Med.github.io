# 1Med 优化待办清单 / Enhancement Backlog

> 面向 codex plan 模式的可执行清单。每一项都带**验收标准**，便于自动循环验证（写测试→跑通→Playwright 检查）。
> 优先级：P0 = 影响正确性/可用性，必须先做；P1 = 明显体验/性能提升；P2 = 锦上添花/工程化。
> 建议按 P0 → P1 → P2 顺序推进，每完成一项跑 `npm test` + `npm run build`，关键 UI 项用 Playwright 截图自查。

---

## P0 · 正确性与可用性

### P0-1 中文题干/选项逐字空格
- **现象**：题库 JSON 里中文带逐字空格，例如 `public/data/practice/banks/-ign大二上 生理学B/1/绪论.json` 的题干 `"关 于 生 理 学 这 门 学 科"`。
- **根因**：`src/features/exercise/exerciseCore.js` 的 `cleanText()` 只做 `\s+ → ' '`，未去除 CJK 字符之间的空格。
- **做法**：在 `cleanText` 后增加一步，删除「CJK 字符 + 空格 + CJK 字符」之间的空格（保留中英文之间、英文单词之间的空格）。正则参考：`/(?<=[一-鿿])\s+(?=[一-鿿])/g → ''`。
- **验收**：在 `exerciseCore.test.js` 增加用例，`"关 于 生 理 学"` → `"关于生理学"`，`"维生素 B12"` 保持不变；练习页加载该题库后题干无逐字空格。

### P0-2 node_modules 被 git 跟踪
- **现象**：`git ls-files node_modules` 返回 691 个文件，导致 `git status` 噪声巨大、仓库臃肿。
- **做法**：`git rm -r --cached node_modules`（`.gitignore` 已忽略，仅停止跟踪，不删本地文件），单独提交。顺带确认 `dist/`、`dev-server*.log` 是否需要忽略。
- **验收**：`git ls-files node_modules` 返回空；`git status` 干净。

### P0-3 进度保存：高频同步写入
- **现象**：`src/pages/ExercisePage.vue` 中 `setTextAnswer`（行 447）和 `setOption`（行 430）每次都同步调用 `saveProgress()`，后者又写 localStorage 并 `upsertExerciseHistory`。填空题逐字符触发，大题库卡顿。
- **做法**：对 `saveProgress` 做去抖（debounce 300–500ms），文本输入尤其需要；切题/提交/收藏等离散动作可保留即时保存。`onBeforeUnmount` 与路由离开时 flush 一次。
- **验收**：连续输入文本时 localStorage 写入次数显著下降（可用临时计数验证）；刷新后进度不丢失。

### P0-4 渲染期重复计算答案
- **现象**：`evaluateAnswer` 被 `correctCount`/`wrongCount`/`answerStatus`/`indexClass`/`questionResult` 在每次响应变化时对每题重算；「全部」视图 + 题号宫格下为 O(n) × 每次点击。
- **做法**：用一个 `computed` 生成 `resultsById`（题 id → 评测结果）映射，所有状态/统计从该映射派生，避免重复求值。
- **验收**：行为不变；大题库（≥150 题）下点击选项无明显卡顿（可用 Performance 面板对比）。

### P0-5 practice 数据目录混入二进制源文件
- **现象**：`public/data/practice/banks/大三下 医学影像学/relative/人卫一类/` 下存在 `.doc`/`.pdf`，会被 Vite 复制进 `dist/data`。
- **做法**：确认这些文件是否是题库运行时需要的；若否，移出 `public/data` 或在构建/同步脚本中排除非 `.json`。同时校验 `path_info.json` 是否引用了它们。
- **验收**：`dist/data/practice` 不含 `.doc/.pdf`；练习页所有题库仍可加载（沿用现有 462 文件校验脚本）。

---

## P1 · 体验与性能

### P1-1 键盘操作
- **现状**：练习页无快捷键（旧 3100 行脚本本有键盘处理，重构时丢失）。
- **做法**：单题视图支持 `←/→` 切题、`1–9 / A–H` 选/切选项、`Enter` 提交并跳下一题、`F` 收藏。仅在练习页激活，输入框聚焦时不拦截。底部或帮助按钮列出快捷键。
- **验收**：键盘可完整完成一套题；Playwright 模拟按键通过。

### P1-2 交卷与成绩汇总
- **现状**：只能逐题提交，无整卷"交卷"与最终成绩页。
- **做法**：加"一键提交全部 / 交卷"，提交后弹出/展开成绩汇总（总分、正确率、各题型正确率、用时），并提供"只看错题""重做错题"入口。
- **验收**：交卷后显示正确数/总数与正确率；"重做错题"只加载错题集。

### P1-3 题号宫格筛选
- **现状**：宫格仅支持"只看收藏"。
- **做法**：增加按状态筛选（未答 / 已答 / 错题 / 收藏），与现有状态色一致。
- **验收**：切换筛选后宫格与题目列表同步过滤。

### P1-4 可见焦点样式（键盘可达性）
- **现象**：`src/styles/base.css` 无任何 `:focus-visible` 样式，键盘 Tab 时看不到焦点。
- **做法**：为 `button/a/input/select/textarea/.option-row` 增加统一 `:focus-visible` 轮廓（用 `--brand`）。
- **验收**：键盘 Tab 遍历所有交互元素均有清晰焦点环；暗色模式对比度达标。

### P1-5 移动端题号抽屉
- **现象**：`@media (max-width: 960px)` 下题号侧栏变成静态块顶在题目上方，把题目挤下去。
- **做法**：移动端将题号宫格改为可折叠抽屉/底部浮层（按钮唤出），默认收起。
- **验收**：窄屏下题目首屏即可见；抽屉可开合。

### P1-6 阅读设置（字号）
- **做法**：练习页提供字号档位（小/中/大），存入 settings；长时间做题更舒适。
- **验收**：切换字号题干/选项实时变化并持久化。

### P1-7 首次访问跟随系统深浅色
- **现象**：`App.vue` 首次默认 light，未读取 `prefers-color-scheme`。
- **做法**：无本地主题记录时按 `window.matchMedia('(prefers-color-scheme: dark)')` 初始化。
- **验收**：系统暗色 + 无本地记录时首屏为暗色；用户手动切换后以本地记录为准。

### P1-8 填空题判分偏弱
- **现象**：`exerciseCore.js` 的 fill 分支 `expected.some(item => item === actual)` 仅整体匹配，多空/同义难命中。
- **做法**：支持按 `；|` 多空分别比对、忽略标点/大小写/全半角；保留"参考答案"展示。补测试用例。
- **验收**：常见多空/带标点填空判定正确；新增单测通过。

---

## P2 · 工程化与可维护性

### P2-1 跨平台构建
- **现象**：`package.json` 的 `build` / `tools:vendor` 依赖 `powershell -File scripts/*.ps1`，非 Windows/CI 直接失败。
- **做法**：将 `sync-static-assets.ps1`、`sync-tools-vendor.ps1` 改写为 Node 脚本（`scripts/*.mjs`，用 `fs`），或提供 Node 版并在 `package.json` 调用 `node`。
- **验收**：`npm run build` 在非 PowerShell 环境（如 `node scripts/sync-static-assets.mjs`）可跑通，产物与现状一致。

### P2-2 ESLint + Prettier
- **做法**：加 `eslint`（含 `eslint-plugin-vue`）+ `prettier`，配 `npm run lint`。修复现有告警。
- **验收**：`npm run lint` 通过；CI 中可跑。

### P2-3 CI 工作流
- **做法**：`.github/workflows/ci.yml`：安装依赖 → `npm test` → `npm run lint` → `npm run build`（构建脚本需先完成 P2-1）。
- **验收**：PR 触发 CI 全绿。

### P2-4 路由标题/SEO
- **现象**：`grep document.title` 无结果，所有页面标题恒为"医鸣惊人"。
- **做法**：路由 `meta.title` + `router.afterEach` 设置 `document.title`（如 `练习台 · 医鸣惊人`）。
- **验收**：切换路由浏览器标签标题随之变化。

### P2-5 组件/服务测试覆盖
- **现状**：仅 `exerciseCore`、`chaoxingRedoBridge` 有测试；`questionBankService`（路径归一化 `normalizePracticePath`）、`exerciseHistoryService`（历史上限/裁剪）等纯逻辑无测试。
- **做法**：为 `normalizePracticePath`、历史 upsert/裁剪/去重补 Node 测试。
- **验收**：`npm test` 用例数增加且全过。

### P2-6 PWA / 离线（可选大件）
- **背景**：学生多在手机上用，离线访问题库 + 加到主屏价值高。
- **做法**：引入 `vite-plugin-pwa`，对 `data/**` 做运行时缓存，加 manifest/图标。
- **验收**：断网后已访问过的题库仍可作答；可"添加到主屏幕"。

---

## 验证基线（每项完成后）
```bash
npm test            # 纯逻辑单测
npm run build       # 构建 + 资源同步（注意 P2-1 前仍需 PowerShell）
# 关键 UI 项：Playwright 打开 #/practice/exercise 自查无 console 错误
```

## 备注 / 取舍
- 题库 JSON 当前为纯文本，未发现题干内嵌 `<img>`/HTML（影像学目录下的是 `.doc/.pdf` 源文件，见 P0-5），故**暂不需要**富文本/图片渲染与 XSS 清洗；若将来导入带图题库再评估。
- 以上未改变现有数据格式与 `1med:v2` localStorage 命名空间，属增量增强。
</content>
</invoke>
