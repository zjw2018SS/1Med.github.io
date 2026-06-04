const namespace = '1med:v2'

function keyOf(key) {
  return `${namespace}:${key}`
}

export function readStorage(key, fallback = null) {
  try {
    const value = localStorage.getItem(keyOf(key))
    return value == null ? fallback : JSON.parse(value)
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(keyOf(key), JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeStorage(key) {
  localStorage.removeItem(keyOf(key))
}
