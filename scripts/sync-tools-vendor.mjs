import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(scriptDir, '..')
const toolsRoot = path.join(root, 'tools')
const vendorRoot = path.join(toolsRoot, 'vendor')

function isInside(parent, child) {
  const relative = path.relative(parent, child)
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}

function removeInsideTools(target) {
  const resolvedTarget = path.resolve(target)
  if (!isInside(toolsRoot, resolvedTarget)) {
    throw new Error(`Refusing to remove path outside tools: ${resolvedTarget}`)
  }
  fs.rmSync(resolvedTarget, { recursive: true, force: true })
}

function copyVendorFile(relativeSource, fileName) {
  const source = path.join(root, relativeSource)
  if (!fs.existsSync(source)) {
    throw new Error(`Missing vendor source: ${relativeSource}. Run npm install first.`)
  }
  fs.copyFileSync(source, path.join(vendorRoot, fileName))
}

removeInsideTools(vendorRoot)
fs.mkdirSync(vendorRoot, { recursive: true })
copyVendorFile('node_modules/sweetalert2/dist/sweetalert2.all.min.js', 'sweetalert2.all.min.js')

console.log('Tools vendor assets synced.')
