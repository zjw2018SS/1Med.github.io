import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    lastQuestionBank: '',
    compactMode: false,
  }),
  actions: {
    rememberQuestionBank(path) {
      this.lastQuestionBank = path || ''
    },
    setCompactMode(value) {
      this.compactMode = Boolean(value)
    },
  },
})
