import { ACK_MESSAGE, EXERCISE_EXTENSION_URL } from './config.js'

export function openExerciseWithBank(bank, options = {}) {
  const url = options.url || EXERCISE_EXTENSION_URL
  const payload = JSON.stringify(bank)
  const target = window.open(url, '_blank')

  if (!target) {
    throw new Error('浏览器拦截了新标签页，请允许弹窗后重试')
  }

  let acknowledged = false
  const interval = window.setInterval(() => {
    if (target.closed || acknowledged) return cleanup()
    target.postMessage(payload, '*')
  }, 300)

  const timeout = window.setTimeout(() => {
    cleanup()
    options.onTimeout?.()
  }, options.timeout || 15000)

  function handleMessage(event) {
    if (event.data !== ACK_MESSAGE) return
    acknowledged = true
    cleanup()
    options.onAck?.()
  }

  function cleanup() {
    window.clearInterval(interval)
    window.clearTimeout(timeout)
    window.removeEventListener('message', handleMessage)
  }

  window.addEventListener('message', handleMessage)
}
