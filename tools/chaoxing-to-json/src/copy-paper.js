export function extractPaperText(doc = document) {
  const direct = findContentRoot(doc)
  if (direct) return direct.innerText

  const frameContent = searchFrames(doc)
  if (frameContent) return frameContent.innerText

  throw new Error('没有找到可复制的题目文本')
}

function searchFrames(doc) {
  const queue = [...doc.querySelectorAll('iframe')]
  const seen = new Set()

  while (queue.length) {
    const frame = queue.shift()
    if (seen.has(frame)) continue
    seen.add(frame)

    const frameDoc = readFrameDocument(frame)
    if (!frameDoc) continue

    const root = findContentRoot(frameDoc)
    if (root) return root
    queue.push(...frameDoc.querySelectorAll('iframe'))
  }

  return null
}

function findContentRoot(doc) {
  return doc.querySelector('#fanyaMarking, #RightCon, .mark_table.padTop60, .mark_table')
}

function readFrameDocument(frame) {
  try {
    return frame.contentDocument || frame.contentWindow?.document || null
  } catch {
    return null
  }
}
