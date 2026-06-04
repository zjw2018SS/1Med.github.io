# 题库工具

这里放独立运行的题库生产工具。它们不属于 Vue 页面代码，但会随 `npm run build` 发布到 `dist/tools`。

## 入口

- `tools/index.html`：工具总入口。
- `tools/chaoxing-to-json/index.html`：chaoxingRedo 本地开发页；用户安装入口是 GreasyFork。
- `tools/json-export-tool/index.html`：文本转题库 JSON 工具。
- `tools/json-export-tool/tool/society.html`：社会学统计题转换工具。
- `tools/userscript-framework/`：通用油猴脚本开发和发布框架。

## 输出兼容约定

工具不再保留旧项目访问路径。兼容性的边界只保留在输出内容上：

- 题库 JSON 可以是数组，也可以是带 `body` 字段的对象。
- 题目字段继续支持 `questions`、`type`、`type_code`、`options`、`answers`、`answers_matching_index`、`analysis`。
- 生成结果应能被新版做题页 `#/practice/exercise` 正常导入、预览和作答。
- chaoxingRedo 会打开 `#/practice/exercise?extension`，通过 `postMessage` 把题库广播给做题页；做题页收到后会回传 `1Med is OK!`。
- `tools/json-export-tool/index.html` 的预览按钮会把当前 JSON 临时传给新版做题页，做题页读取后立即删除临时数据。

## 依赖约定

- 浏览器依赖统一来自根项目 `package.json`，不要手工复制压缩包。
- `npm run tools:vendor` 会把官方发布文件同步到 `tools/vendor/`。
- `tools/vendor/` 是生成目录，不手写业务代码。
- 生产构建会复制用户需要打开的工具文件，不复制 `node_modules`、`build`、`dev`、`test` 等开发目录。
- chaoxingRedo 使用 `vite-plugin-monkey` 构建，`npm run chaoxing:build` 会输出 `tools/chaoxing-to-json/dist/chaoxingRedo.user.js`。

## 维护流程

1. 修改工具源码。
2. 运行 `npm run tools:vendor` 同步浏览器依赖。
3. 修改 chaoxingRedo 后运行 `npm run chaoxing:build`。
4. 运行 `npm test` 验证新版做题页仍能读取工具输出。
5. 运行 `npm run build` 验证生产包。
