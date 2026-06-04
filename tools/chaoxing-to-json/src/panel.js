import { GREASYFORK_URL } from './config.js'

export function mountPanel(handlers) {
  document.getElementById('cxr-root')?.remove()

  const root = htmlToElement(`
    <section id="cxr-root" class="cxr-root" aria-label="chaoxingRedo">
      <button class="cxr-fab" type="button" title="chaoxingRedo">
        <span aria-hidden="true">⚙</span>
      </button>
      <div class="cxr-panel" data-open="0">
        <div class="cxr-section">
          <h2>1. 常规显示</h2>
          <label><span>鼠标悬停显示我的答案</span><input data-toggle-class="cxr-hide-my-answer" type="checkbox" /></label>
          <label><span>鼠标悬停显示正确答案</span><input data-toggle-class="cxr-hide-correct-answer" type="checkbox" /></label>
          <label><span>鼠标悬停显示答案解析</span><input data-toggle-class="cxr-hide-analysis" type="checkbox" /></label>
          <label><span>全屏模式</span><input data-fullscreen type="checkbox" /></label>
        </div>
        <div class="cxr-section">
          <h2>2. 题目功能</h2>
          <div class="cxr-actions">
            <strong class="cxr-count">题目识别中</strong>
            <button data-action="copy-json" type="button">复制</button>
            <button data-action="download-json" type="button">下载</button>
            <button data-action="redo" type="button">重做</button>
            <button data-action="copy-paper" type="button">复制题目（纯文本）</button>
          </div>
          <p class="cxr-status"></p>
        </div>
        <div class="cxr-section">
          <h2>3. 说明&问题反馈</h2>
          <p>重做题目在本站做题页本地进行。脚本优先识别学习通作业、考试、自测结果页里的常规选择题、判断题、填空题和简答题。</p>
          <p>
            <a href="${GREASYFORK_URL}" target="_blank" rel="noopener noreferrer">安装/更新</a>
            <a href="https://xn--xkrra975bzrc.icu/#/practice/exercise" target="_blank" rel="noopener noreferrer">新版做题页</a>
          </p>
          <p>问题反馈：<span>chatgpt.usc@gmail.com</span></p>
        </div>
      </div>
    </section>
  `)

  document.body.append(root)

  const panel = root.querySelector('.cxr-panel')
  const count = root.querySelector('.cxr-count')
  const status = root.querySelector('.cxr-status')

  root.querySelector('.cxr-fab').addEventListener('click', () => {
    panel.dataset.open = panel.dataset.open === '1' ? '0' : '1'
  })

  root.querySelectorAll('[data-toggle-class]').forEach((input) => {
    input.addEventListener('change', () => {
      document.body.classList.toggle(input.dataset.toggleClass, input.checked)
    })
  })

  root.querySelector('[data-fullscreen]').addEventListener('change', async (event) => {
    if (event.target.checked) await document.documentElement.requestFullscreen?.()
    else await document.exitFullscreen?.()
  })

  bindAction(root, 'copy-json', () => handlers.onCopyJson?.())
  bindAction(root, 'download-json', () => handlers.onDownloadJson?.())
  bindAction(root, 'redo', () => handlers.onRedo?.())
  bindAction(root, 'copy-paper', () => handlers.onCopyPaper?.())

  return {
    updateCount() {
      try {
        const bank = handlers.getBank()
        count.textContent = `共 ${bank.body.length} 个题目`
        count.dataset.state = 'ok'
      } catch {
        count.textContent = '题目识别失败'
        count.dataset.state = 'error'
      }
    },
    setStatus(message, tone = '') {
      status.textContent = message || ''
      status.dataset.tone = tone
    },
  }
}

function bindAction(root, action, handler) {
  root.querySelector(`[data-action="${action}"]`)?.addEventListener('click', handler)
}

function htmlToElement(template) {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = template.trim()
  return wrapper.firstElementChild
}
