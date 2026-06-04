import { dataPath, fetchJson } from './assetService.js'

export async function loadQuickLinks() {
  const rows = await fetchJson(dataPath('home/quick-links.json'))
  return rows.map((item, index) => ({
    id: `quick-link-${index}`,
    label: item.label || `入口 ${index + 1}`,
    href: item.href || '#',
  }))
}
