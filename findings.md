# 1Med Refactor Findings

## Baseline Architecture Before Refactor

- The root package already declares Vue 3, Vite, SweetAlert2, and `@vitejs/plugin-vue`.
- Most of the project is still static multi-page HTML/JS/CSS.
- Root pages include `index.html`, `learning.html`, and `resource.html`.
- The exercise system lives under `习题/` with its own HTML, CSS, JavaScript, JSON question banks, and copied dependencies.
- `src/` currently contains only a small resource edit toolbar experiment, not a full application shell.

## Baseline High-Risk Areas

- `习题/js/exercise.js` is the main complexity hotspot: about 3100 lines and mixes state, DOM operations, localStorage, import/export, keyboard handling, scroll behavior, and answer checking.
- There are many static JSON/PDF/DOCX assets; moving them aggressively risks breaking URLs.
- Several pages directly load scripts/styles from `node_modules`, which is not compatible with a clean production build.
- README text appears mojibake/encoding-damaged.
- The current `node_modules` install is incomplete: Vite is missing its `dist` directory.

## Recommended Migration Direction

- Use a Vue Router SPA as the new main entry.
- Preserve legacy pages under their current paths during migration.
- Build a service layer before rewriting complex UI.
- Treat question bank data as static public data first; normalize later.

## Follow-Up Findings

- `习题/` has been removed. Runtime question-bank data now lives under `public/data/practice`.
- The 学习通 export/conversion tooling was kept outside runtime code at `tools/chaoxing-to-json`; the JSON export helper is at `tools/json-export-tool`.
- The new exercise page accepts the JSON format produced by those tools through normal JSON import or files placed under `public/data/practice/banks`.
- No `path_dir_integration.php` file is present in the current tree. The new app replaces directory-discovery/runtime path code with static `catalog.json` and `path_info.json` loading in `src/services/questionBankService.js`.
- User-maintained content is now centralized in `public/data`, with old `static/json` duplicates removed.
- `tools/` is now treated as standalone static tooling, not Vue runtime code. Production builds copy it to `dist/tools`, but exclude nested `node_modules`, `build`, `dev`, `test`, and package metadata.
- Browser-loadable tool dependencies are generated from root npm dependencies into `tools/vendor` by `npm run tools:vendor`; current tools only require SweetAlert2.
- Old path compatibility aliases were removed. The compatibility boundary is now output content only: generated JSON must be readable by the Vue exercise page.
- The old `tools/json-export-tool/exercise.html` preview surface was removed. `tools/json-export-tool/index.html` previews by opening the Vue exercise route with a temporary `1med:tool-preview-bank` localStorage handoff that is deleted after loading.
- The maintained chaoxingRedo implementation is now the canonical `tools/chaoxing-to-json/` implementation. The nested `tools/chaoxing-to-json/chaoxingRedo/` path has been removed from source and production builds.
- The Vue 工具资源 page is now intentionally limited to 本站工具 entries from `public/data/resources/resources.json`; external tool recommendations such as LocalSend/PowerToys are no longer part of runtime data.
- `vite-plugin-monkey` is the adopted userscript framework because it builds `.user.js`/`.meta.js` for userscript engines and matches the project's Vite 8 dependency. WXT and Plasmo were not adopted because their npm descriptions target web extensions rather than userscripts.
- User-facing chaoxingRedo links now point to the GreasyFork script page. Local project files under `tools/chaoxing-to-json/` are for development, docs, and generated publish artifacts.
- The new chaoxingRedo handoff URL is `https://xn--xkrra975bzrc.icu/#/practice/exercise?extension`. The Vue exercise page now supports that query by listening for a JSON `postMessage` payload and acknowledging with `1Med is OK!`.
