export function assetPath(path) {
  const clean = String(path || '').replace(/^\.?\//, '')
  return `${import.meta.env.BASE_URL}${clean}`
}

export function dataPath(path) {
  const clean = String(path || '').replace(/\\/g, '/').replace(/^\.?\//, '').replace(/^data\//, '')
  return assetPath(`data/${clean}`)
}

export async function fetchJson(path) {
  const response = await fetch(encodeURI(path), { cache: 'no-cache' })
  if (!response.ok) {
    throw new Error(`请求失败：${response.status} ${response.statusText}`)
  }
  return response.json()
}
