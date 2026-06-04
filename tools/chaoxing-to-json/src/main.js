import './panel.css'
import { copyText } from './clipboard.js'
import { extractPaperText } from './copy-paper.js'
import { downloadJson } from './download.js'
import { extractQuestionBank } from './extractor.js'
import { openExerciseWithBank } from './messaging.js'
import { SCRIPT_NAME } from './config.js'
import { mountPanel } from './panel.js'

let panel

function getBank() {
  return extractQuestionBank(document)
}

async function withBank(action) {
  try {
    const bank = getBank()
    panel.updateCount()
    await action(bank)
  } catch (error) {
    console.error(`[${SCRIPT_NAME}]`, error)
    panel.setStatus(error instanceof Error ? error.message : '脚本执行失败', 'error')
  }
}

panel = mountPanel({
  getBank,
  async onCopyJson() {
    await withBank(async (bank) => {
      await copyText(JSON.stringify(bank))
      panel.setStatus('已复制题库 JSON', 'ok')
    })
  },
  async onDownloadJson() {
    await withBank(async (bank) => {
      downloadJson(JSON.stringify(bank, null, 2), bank.head?.filename)
      panel.setStatus('已下载题库 JSON', 'ok')
    })
  },
  onRedo() {
    withBank((bank) => {
      openExerciseWithBank(bank, {
        onAck: () => panel.setStatus('做题页已接收题库', 'ok'),
        onTimeout: () => panel.setStatus('做题页未确认接收，若页面已打开可稍后查看', 'error'),
      })
      panel.setStatus('正在向做题页发送题库')
    })
  },
  async onCopyPaper() {
    try {
      await copyText(extractPaperText(document))
      panel.setStatus('已复制题目纯文本', 'ok')
    } catch (error) {
      console.error(`[${SCRIPT_NAME}]`, error)
      panel.setStatus(error instanceof Error ? error.message : '复制题目失败', 'error')
    }
  },
})

panel.updateCount()
console.log(`${SCRIPT_NAME} 启动成功`)
