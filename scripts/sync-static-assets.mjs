import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(scriptDir, '..')
const distRoot = path.join(root, 'dist')

const excludedToolDirectories = new Set(['node_modules', 'build', 'dev', 'src', 'test'])
const excludedToolFiles = new Set(['package.json', 'package-lock.json'])

function isInside(parent, child) {
  const relative = path.relative(parent, child)
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}

function removeInsideDist(target) {
  const resolvedTarget = path.resolve(target)
  if (!isInside(distRoot, resolvedTarget)) {
    throw new Error(`Refusing to remove path outside dist: ${resolvedTarget}`)
  }
  fs.rmSync(resolvedTarget, { recursive: true, force: true })
}

function copyDirectory(source, destination) {
  if (!fs.existsSync(source)) return
  removeInsideDist(destination)
  copyDirectoryChildren(source, destination)
}

function copyDirectoryChildren(source, destination, options = {}) {
  fs.mkdirSync(destination, { recursive: true })
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (entry.isDirectory() && options.excludedDirectoryNames?.has(entry.name)) continue
    if (entry.isFile() && options.excludedFileNames?.has(entry.name)) continue

    const sourcePath = path.join(source, entry.name)
    const destinationPath = path.join(destination, entry.name)
    if (entry.isDirectory()) {
      copyDirectoryChildren(sourcePath, destinationPath, options)
    } else if (entry.isFile()) {
      fs.mkdirSync(path.dirname(destinationPath), { recursive: true })
      fs.copyFileSync(sourcePath, destinationPath)
    }
  }
}

function copyDirectoryFiltered(source, destination, options) {
  if (!fs.existsSync(source)) return
  removeInsideDist(destination)
  copyDirectoryChildren(source, destination, options)
}

function copyFile(source, destination) {
  if (!fs.existsSync(source)) return
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(source, destination)
}

fs.mkdirSync(distRoot, { recursive: true })
copyDirectory(path.join(root, 'static'), path.join(distRoot, 'static'))
copyDirectory(path.join(root, 'img'), path.join(distRoot, 'img'))
copyDirectoryFiltered(path.join(root, 'tools'), path.join(distRoot, 'tools'), {
  excludedDirectoryNames: excludedToolDirectories,
  excludedFileNames: excludedToolFiles,
})
copyFile(path.join(root, 'favicon.ico'), path.join(distRoot, 'favicon.ico'))
copyFile(path.join(root, 'CNAME'), path.join(distRoot, 'CNAME'))

console.log('Static assets synced.')
