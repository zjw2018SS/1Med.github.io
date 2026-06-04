# 油猴脚本开发框架

本目录提供项目内通用的油猴脚本构建约定。当前使用 `vite-plugin-monkey`，因为它直接面向 Tampermonkey、Violentmonkey、Greasemonkey、ScriptCat 这类用户脚本环境，能用 Vite 开发并输出 `.user.js` 和 `.meta.js`。

## 约定

- 每个脚本保留自己的 `vite.config.js`。
- 脚本源码放在各自工具目录的 `src/`。
- 发布产物输出到各自工具目录的 `dist/`。
- 生产包会复制 `dist/` 中的用户可安装脚本，不复制 `src/`、`node_modules/`、`dev/`、`test` 等开发目录。
- 面向 GreasyFork 发布的脚本不压缩，便于审查。

## 命令

```bash
npm run chaoxing:dev
npm run chaoxing:hmr
npm run chaoxing:build
```

`chaoxing:dev` 面向本地安装验收：先构建完整 `.user.js`，再用 Vite 打开可安装脚本。`chaoxing:hmr` 面向开发调试：使用 `vite-plugin-monkey` 的热更新注入脚本，可能受目标站点 CSP 影响。

新增用户脚本时，复用 `createUserscriptConfig.js`，只需要传入入口文件、输出目录和 metadata。
