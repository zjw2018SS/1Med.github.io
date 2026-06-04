# 1Med Vue3 Refactor Plan

Goal: Refactor the project into a maintainable Vue 3 + Vite application while preserving the existing static assets, question banks, and user-facing behavior.

## Phase 1: Baseline And Build Repair
Status: complete

- Document current architecture and risks.
- Repair dependency installation so `npm run build` works.
- Check Vite multi-page/static path constraints.

## Phase 2: New Application Shell
Status: complete

- Add a standard Vue app entry with router, shared layout, and global styles.
- Keep old static pages available while new routes are introduced.
- Configure Vite for the refactored entry.

## Phase 3: Data And Service Layer
Status: complete

- Add typed/domain-focused services for resources, learning/course data, and question-bank loading.
- Avoid moving large document/PDF/question assets until URLs are understood.
- Encapsulate localStorage access.

## Phase 4: Page Migration
Status: complete

- Migrate home, learning, resource, practice home, course, and dream pages into Vue pages.
- Preserve links to existing assets and legacy pages where migration is not yet safe.

## Phase 5: Exercise Refactor
Status: complete

- Extract pure exercise logic from the legacy large script.
- Build Vue exercise UI components around the extracted logic.
- Preserve JSON import, directory/file selection, progress storage, favorites, and answer display behavior where feasible.

## Phase 6: Cleanup And Compatibility
Status: complete

- Remove broken or unused direct `node_modules` browser references from new app paths.
- Keep legacy files only as fallbacks.
- Update README and add migration notes.

## Phase 7: Verification
Status: complete

- Run build.
- Run targeted logic checks.
- Start dev server and inspect key pages when feasible.

## Phase 8: Mobile Access And User Workflow Enhancements
Status: complete

- Configure Vite dev server for LAN access.
- Add exercise answer-card status, history/resume, restart, all/single-question views, and optional auto-submit.
- Add sort direction controls for course/catalog-oriented pages.
- Add dark mode and theme switching.
- Preserve requested home-page quick links.
- Document answers for legacy processing scripts and future content CRUD.

## Phase 9: Follow-Up UI Polish
Status: complete

- Improve dark-mode contrast for selects, theme controls, and answer/practice controls.
- Let practice file/history links open in a new tab where it helps preserve the current page.
- Collapse exercise history so it no longer pushes the question area down.

## Phase 10: Remove Legacy Exercise Directory Dependency
Status: complete

- Move maintainable content into a unified `public/data` directory.
- Rewrite services to read the new data layout only.
- Remove legacy Vite multi-page compatibility entries and legacy redirect pages.
- Move reusable export/conversion tools out of `习题` if they are still useful, then remove the `习题` directory.
- Verify build, tests, and key browser flows without any runtime dependency on `习题`.

## Phase 11: Refactor Tools With Compatibility
Status: complete

- Keep existing tool entry URLs working under `tools/chaoxing-to-json/` and `tools/json-export-tool/`.
- Remove browser runtime reliance on ignored `node_modules` paths where feasible.
- Add a stable tools index and maintenance documentation.
- Copy tools into production builds without copying nested `node_modules`.
- Verify old and new tool entry pages still load.

## Phase 12: Refactor Tools For New Project
Status: complete

- Remove old-path compatibility aliases and wording from `tools/`.
- Keep tool output compatibility: generated question-bank JSON and chaoxingRedo preview output must still be accepted by the new Vue exercise page.
- Replace temporary SweetAlert/Clipboard compatibility wrappers with real npm-managed browser assets.
- Keep all new documentation in Chinese or Chinese-first bilingual wording.
- Verify tools load in dev/build without `node_modules` being served directly.

## Phase 13: Promote chaoxingRedo And Localize Resources
Status: complete

- Promote maintained `chaoxingRedo` files to `tools/chaoxing-to-json/`.
- Remove the older base 学习通转 JSON implementation from that directory.
- Update tool index/docs/build scripts to use the promoted path.
- Keep resource page data limited to本站工具 entries.
- Verify dev/build outputs do not include the removed nested `chaoxingRedo` path.

## Phase 14: Userscript Framework And chaoxingRedo Rewrite
Status: complete

- Point user-facing chaoxingRedo install links to the GreasyFork script page.
- Add credit-based sorting to the course information page.
- Evaluate and add a maintainable userscript build framework for chaoxingRedo.
- Refactor chaoxingRedo into modular source files with extraction, messaging, UI, clipboard/download, and copy-paper concerns separated.
- Build a publishable `.user.js` artifact and keep the Vue exercise page compatible with extension broadcast loading.
- Verify tests, build, and browser-visible entry pages.

## Phase 15: Local Userscript Install Flow
Status: complete

- Identify that `chaoxing:dev` installed a Vite HMR userscript that depends on module injection into the 学习通 page.
- Make `chaoxing:dev` build and serve the complete local `.user.js` for installation.
- Keep the HMR workflow available as `chaoxing:hmr`.
- Fix the HMR userscript name prefix so it becomes `dev:chaoxingRedo...` instead of only `dev:`.
- Document when to use local build install versus HMR debugging.
- Verify chaoxing userscript build, test suite, complete app build, and temporary HMR metadata.

## Errors Encountered

| Error | Attempt | Resolution |
| --- | --- | --- |
| `npm run build` failed because `node_modules/vite/dist/node/cli.js` is missing | Initial baseline build | Full `node_modules` reinstall fixed it |
| `npm run build` then failed because `node_modules/rollup/dist/es/parseAst.js` is missing | Reinstalled Vite only | Full `node_modules` reinstall fixed it |
| PowerShell rejected `&&` as a statement separator | Tried combined npm install command | Retry installs as separate commands |
| PowerShell rejected `node - <<'NODE'` here-doc syntax | Tried Unix-style inline Node script | Retry with PowerShell here-string piped to Node |
| PowerShell pipe mangled Chinese literals inside an inline Node script | Tried paths with Chinese characters in stdin script | Use directory traversal instead of literal Chinese paths |
| Build copied legacy `习题` assets into mojibake `涔犻` directory | Vite config contained direct Chinese path strings | Replaced path strings with Unicode escape constants |
| Vite and Vitest print successful output but process exits with `-1073740791` | Ran through npm and direct Node entrypoints | Removed Vite copy plugin and replaced Vitest with Node test runner |
| `Start-Process npm` failed with `%1 is not a valid Win32 application` | Tried starting dev server through `npm` without extension | Retry with `npm.cmd` |
| PowerShell refused loop variable `$pid` because `$PID` is read-only | Tried stopping dev server by port | Retry with `$processId` |
| `git status` failed due to dubious ownership / safe.directory | Initial repository check | Pending; avoid destructive git actions |
| Playwright timed out while selecting the course sort dropdown | Used a page-global `select` index that hit the semester dropdown instead of the sort dropdown | Retried with `.toolbar select` scoped to the page toolbar |
| Dev server exited after browser verification | Started through npm and then killed the duplicate child process | Restarted Vite directly with Node on `0.0.0.0:5173 --strictPort` |
| PowerShell mangled Chinese regex literals in an inline Node migration script | Tried replacing paths with direct Chinese literals | Retried with Unicode escapes and path traversal checks |
| Some migrated question-bank JSON files were empty | Full JSON validation caught parse failures in referenced files | Converted referenced empty files to valid empty arrays `[]` |
| Vite returned 500 for `tools/json-export-tool/index.html` | Browser-checked the static tool page under the dev server | Escaped visible regex lookbehind text as HTML entities so Vite can parse the page while the displayed regex remains unchanged |
| npm audit reported Vite/esbuild development-server advisories | Full audit after tool dependency changes | Upgraded Vite to 8.0.15 and `@vitejs/plugin-vue` to 6.0.7; audit now reports 0 vulnerabilities |
| npm cleanup could not remove old Rollup/esbuild temp directories while dev tooling was active | Upgraded Vite while a dev server had recently been running | Install completed successfully; restarted the dev server on 5173 and verified build/test/audit |
| Playwright wrapper launched through Bash tried Linux `xdg-open` and failed | Tried the skill wrapper from PowerShell via `bash -lc` | Used Windows `npx --package @playwright/cli playwright-cli ...` directly for browser verification |
| Large `apply_patch` failed because `package.json` context changed after dependency install | Tried one patch for framework, docs, scripts, and package updates | Split the edits into smaller patches and re-read current `package.json` |
| Local `chaoxing:dev` userscript can fail on 学习通 pages | The HMR dev script injects `type="module"` from the local Vite server into a third-party HTTPS page | Changed `chaoxing:dev` to install the complete built `.user.js`; kept the injection workflow under `chaoxing:hmr` for debugging |
## Phase 16: Enhancement Backlog
Status: complete

- Completed all P0 correctness and usability items from `enhancement-backlog.md`.
- Completed all P1 experience and performance items from `enhancement-backlog.md`.
- Completed all P2 engineering items from `enhancement-backlog.md`, including lint, CI, route titles, service tests, and PWA runtime caching.
- Verified each item with `npm test` and `npm run build`; verified UI items with Playwright where applicable.
