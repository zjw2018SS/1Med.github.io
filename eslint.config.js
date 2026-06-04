import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import globals from 'globals'
import vue from 'eslint-plugin-vue'

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.playwright-cli/**',
      'public/data/**',
      'source-materials/**',
      'tools/vendor/**',
      'tools/chaoxing-to-json/dist/**',
    ],
  },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  prettier,
  {
    files: ['**/*.{js,mjs,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
]
