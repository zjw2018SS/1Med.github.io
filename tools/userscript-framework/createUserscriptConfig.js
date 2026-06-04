import { defineConfig } from 'vite'
import monkey from 'vite-plugin-monkey'

export const GREASYFORK_CHAOXING_REDO_URL =
  'https://greasyfork.org/zh-CN/scripts/518327-chaoxingredo-%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96-%E6%B5%8F%E8%A7%88%E5%99%A8%E6%9C%AC%E5%9C%B0%E9%87%8D%E5%81%9A%E4%B9%A0%E9%A2%98'

export function createUserscriptConfig(options) {
  const {
    entry,
    outDir,
    fileName,
    name,
    namespace = 'https://xn--xkrra975bzrc.icu/',
    version,
    description,
    author,
    match,
    homepageURL,
    supportURL,
    icon = 'https://xn--xkrra975bzrc.icu/favicon.ico',
  } = options

  return defineConfig({
    publicDir: false,
    build: {
      outDir,
      emptyOutDir: true,
      minify: false,
      sourcemap: false,
    },
    plugins: [
      monkey({
        entry,
        userscript: {
          name,
          namespace,
          version,
          author,
          description,
          match,
          icon,
          homepageURL,
          supportURL,
          license: 'MIT',
          'run-at': 'document-end',
          grant: 'none',
        },
        build: {
          fileName,
          metaFileName: true,
          autoGrant: true,
        },
        server: {
          open: false,
          prefix: (scriptName) => `dev:${scriptName}`,
        },
      }),
    ],
  })
}
