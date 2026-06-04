import { fileURLToPath } from 'node:url'
import { createUserscriptConfig, GREASYFORK_CHAOXING_REDO_URL } from '../userscript-framework/createUserscriptConfig.js'

export default createUserscriptConfig({
  entry: fileURLToPath(new URL('./src/main.js', import.meta.url)),
  outDir: fileURLToPath(new URL('./dist', import.meta.url)),
  fileName: 'chaoxingRedo.user.js',
  name: 'chaoxingRedo（学习通显示优化，浏览器本地重做习题）',
  version: '0.1.0',
  author: '听雨荷',
  description: '在学习通作业结果页识别题目，复制、下载题库 JSON，并跳转本站做题页本地重做。',
  match: ['https://mooc1.chaoxing.com/*'],
  homepageURL: GREASYFORK_CHAOXING_REDO_URL,
  supportURL: `${GREASYFORK_CHAOXING_REDO_URL}/feedback`,
})
