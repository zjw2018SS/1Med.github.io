# 部署与运维

医鸣惊人（`1med`）的部署、发布和日常维护说明。面向协作者 / AI。

## 架构概览

- **公网主站**：**GitHub Pages**，由 GitHub Actions 自动构建发布。自定义域名 `xn--xkrra975bzrc.icu`（仓库根目录 `CNAME` 文件 + Pages 设置）。
- **备用部署**：自有服务器（1Panel 静态站点）。通过本地脚本 `scripts/deploy.sh` 手动发布。该脚本含私有服务器信息，**已 gitignore，不入库**；服务器运维细节见本机的 `DEPLOYMENT.local.md`。

> 这是一个 Vue 3 + Vite 的纯静态站点（hash 路由），`vite.config.js` 里 `base: './'`（相对路径），因此部署到任何目录/域名都能正确加载，服务器端不需要额外的 nginx 重写规则。

## 版本管理

- 版本号维护在 `package.json` 的 `version` 字段，并打同名 git tag（如 `v2.0.0`）。
- 当前版本：**2.0.0**。
- 发版本时：改 `package.json` 版本 → 提交 → `git tag -a vX.Y.Z -m "..."` → `git push origin main --tags`。

## 日常发布（GitHub Pages，自动）

改完代码或内容后：

```bash
git push origin main
```

`.github/workflows/deploy-pages.yml` 会自动：`npm ci` → `npm run build` → 把 `dist/` 发布到 GitHub Pages。约 1–2 分钟后公网域名即更新。**无需手动构建，构建产物不入库。**

前置一次性设置（已完成，记录备查）：仓库 **Settings → Pages → Source = "GitHub Actions"**。

查看发布状态（需已登录 gh）：

```bash
gh run list --workflow "Deploy to GitHub Pages" --limit 5
gh run watch            # 盯着最近一次运行
```

## 内容更新

所有内容数据在 `public/data/` 下，改完照常 `git push` 即自动发布：

- 首页快捷入口：`public/data/home/quick-links.json`
- 学习资料：`public/data/learning/courses.json`
- 题库目录：`public/data/practice/catalog.json`
- 题库题目：`public/data/practice/banks/**/path_info.json` 及同目录题库 JSON
- 工具资源：`public/data/resources/resources.json`
- 课程信息：`public/data/courses/course-info.json`

## 本地开发

```bash
npm install
npm run dev        # 开发服务器，默认 0.0.0.0:5173
npm test           # 做题核心逻辑测试
npm run lint
npm run build      # 生成 dist/（含同步 CNAME、img、static、tools）
npm run preview    # 预览构建产物
```

CI（`.github/workflows/ci.yml`）在每次 push / PR 上跑 test + lint + build，Node 22。

## 自有服务器部署（可选）

公网以 GitHub Pages 为主；如需同步到自有服务器，在 Git Bash 里：

```bash
bash scripts/deploy.sh
```

脚本会构建 → 打包 → 上传 → 服务器端备份旧站 → 换上新版（SSH 私钥口令运行时输入，保留最近 5 份备份可回滚）。脚本本身与服务器细节见 `DEPLOYMENT.local.md`（本地，不入库）。

## 注意事项

- **国内访问 GitHub**：从中国大陆直连 GitHub（push / Actions / 访问 Pages）通常需要代理，否则会 `Connection reset`。
- **gh 与工作流文件**：用 `gh auth login` 默认拿到的 token 不含 `workflow` 权限，推送对 `.github/workflows/` 的修改会被拒。需要时 `gh auth refresh -h github.com -s workflow` 补权限。
- **GitHub Pages 不会自动构建**：它只托管仓库原始文件。本项目是 Vue 工程，**必须**靠上面的 Actions 工作流构建后发布，不能直接把源码当静态站点。

## 工具链

- gh CLI：本机安装在 `C:\Dev\gh`（便携版），已登录账号 `zjw2018SS`。
