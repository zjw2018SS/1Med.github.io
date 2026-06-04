export function downloadJson(content, name = '学习通题目') {
  const link = document.createElement('a')
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' })
  link.href = URL.createObjectURL(blob)
  link.download = `${safeFileName(name)}.json`
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(link.href)
}

export function safeFileName(value) {
  return String(value || '学习通题目')
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
}
