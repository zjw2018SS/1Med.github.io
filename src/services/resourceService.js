import { dataPath, fetchJson } from './assetService.js'

export async function loadResources() {
  const rows = await fetchJson(dataPath('resources/resources.json'))
  return rows.map((item, index) => ({ id: `resource-${index}`, ...item }))
}
