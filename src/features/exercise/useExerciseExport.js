import { formatExportContent } from '@/features/exercise/exerciseCore'
import { exportRangeLabel, safeFileName } from '@/features/exercise/exerciseSession'

const MIME = {
  json: 'application/json;charset=utf-8',
  txt: 'text/plain;charset=utf-8',
  csv: 'text/csv;charset=utf-8',
}

function downloadTextFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType || 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

// Builds and downloads the current export selection. Pure formatting stays in exerciseCore.
export function exportBank({ rows, title, range, format }) {
  if (!rows.length) return
  const content = formatExportContent(rows, { title, range, exportedAt: Date.now() }, format)
  const downloadContent = format === 'csv' ? `${String.fromCharCode(0xfeff)}${content}` : content
  downloadTextFile(downloadContent, `${safeFileName(title)}-${exportRangeLabel(range)}.${format}`, MIME[format])
}
