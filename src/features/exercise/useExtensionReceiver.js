import { onBeforeUnmount } from 'vue'
import { parseExtensionPayload } from '@/features/exercise/exerciseSession'

const EXTENSION_ACK = '1Med is OK!'
const RECEIVE_TIMEOUT = 15000

// Receives a question bank pushed from the chaoxingRedo userscript via window.postMessage.
// The messaging protocol (ack string, origin handling, timeout) must not change.
export function useExtensionReceiver({ applyQuestionBank, setBankTitle, setLoadError, getQuestionCount, getTitle }) {
  let cleanup = null

  function start() {
    cleanup?.()
    setBankTitle('等待 chaoxingRedo 发送题库...')
    setLoadError('')

    const timeoutId = window.setTimeout(() => {
      if (!getQuestionCount()) {
        setLoadError('等待 chaoxingRedo 题库数据超时，请回到学习通页面重新点击重做。')
      }
      teardown()
    }, RECEIVE_TIMEOUT)

    function teardown() {
      window.clearTimeout(timeoutId)
      window.removeEventListener('message', handleMessage)
      cleanup = null
    }

    function handleMessage(event) {
      let raw
      try {
        raw = parseExtensionPayload(event.data)
      } catch {
        return
      }
      if (!raw) return

      const title = raw?.head?.filename || raw?.head?.title || getTitle() || 'chaoxingRedo 题库'
      applyQuestionBank(raw, title, 'extension:chaoxingRedo')

      const targetOrigin = event.origin && event.origin !== 'null' ? event.origin : '*'
      event.source?.postMessage(EXTENSION_ACK, targetOrigin)
      window.opener?.postMessage(EXTENSION_ACK, '*')
      teardown()
    }

    window.addEventListener('message', handleMessage)
    cleanup = teardown
  }

  onBeforeUnmount(() => cleanup?.())

  return { start }
}
