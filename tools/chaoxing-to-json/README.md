# chaoxingRedo 使用说明

这个工具是学习通油猴脚本，用于在学习通作业页面提取已经做过的题目，并导出为本项目做题页可以读取的 JSON。

## 入口

- GreasyFork 安装/更新页：<https://greasyfork.org/zh-CN/scripts/518327-chaoxingredo-%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96-%E6%B5%8F%E8%A7%88%E5%99%A8%E6%9C%AC%E5%9C%B0%E9%87%8D%E5%81%9A%E4%B9%A0%E9%A2%98>
- 本地开发页：`tools/chaoxing-to-json/index.html`
- JSON 题库生成工具：`tools/json-export-tool/index.html`
- 新版做题页：`#/practice/exercise`

## 开发和发布

源码已经迁移到 `tools/chaoxing-to-json/src`，构建使用项目通用油猴框架 `tools/userscript-framework`。

```bash
npm run chaoxing:dev
npm run chaoxing:hmr
npm run chaoxing:build
```

本地安装测试优先使用 `npm run chaoxing:dev`。这个命令会生成完整的 `tools/chaoxing-to-json/dist/chaoxingRedo.user.js`，并通过本地 Vite 服务打开它，安装后脚本不依赖本地 dev server。

`npm run chaoxing:hmr` 是热更新调试模式，安装页由 `vite-plugin-monkey` 提供。它生成的 `dev:` 脚本会在学习通页面动态插入本地 `type="module"` 脚本，可能被学习通页面的 CSP、混合内容策略或浏览器安全策略拦截；如果页面一直加载或面板不出现，先改用 `npm run chaoxing:dev` 安装完整构建产物。

发布产物输出到 `tools/chaoxing-to-json/dist/chaoxingRedo.user.js`，同时生成 `chaoxingRedo.meta.js`。

## 基本流程

1. 在学习通作业结果页运行脚本。
2. 点击脚本面板中的复制或下载，得到 JSON。
3. 在新版做题页点击 `导入 JSON`，或把整理后的 JSON 放入 `public/data/practice/banks`。

## 输出说明

工具输出的题库 JSON 以新版做题页可读取为准，不再维护旧项目路径。生成后可直接导入新版做题页，也可以放入 `public/data/practice/banks` 作为正式题库。
