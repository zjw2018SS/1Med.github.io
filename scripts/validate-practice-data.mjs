import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const dataRoot = path.resolve('public/data')
const practiceRoot = path.join(dataRoot, 'practice')
const failOnBinary = process.argv.includes('--no-binary')
const binaryPattern = /\.(docx?|pdf)$/i

const summary = {
  pathInfoFiles: 0,
  references: 0,
  referencedJsonFiles: 0,
  binaryFiles: 0,
}

const problems = []

function normalizePracticePath(value) {
  let clean = String(value || '')
    .replace(/\\/g, '/')
    .replace(/^\.?\//, '')
    .replace(/^data\//, '')
  if (!clean.startsWith('practice/')) clean = `practice/banks/${clean}`
  return clean
}

function isInside(parent, child) {
  const relative = path.relative(parent, child)
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function collectPaths(value) {
  if (Array.isArray(value)) return value.flatMap(collectPaths)
  if (typeof value === 'string') return [value]
  if (value && typeof value === 'object') return collectPaths(value.path)
  return []
}

function walk(dir, onFile) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(fullPath, onFile)
    } else {
      onFile(fullPath)
    }
  }
}

function validateReference(rawPath, pathInfoFile) {
  summary.references += 1
  const normalized = normalizePracticePath(rawPath)
  if (!/\.json(?:$|[?#])/i.test(normalized)) {
    problems.push(`Non-JSON reference in ${path.relative(process.cwd(), pathInfoFile)}: ${rawPath}`)
    return
  }

  const target = path.resolve(dataRoot, normalized)
  if (!isInside(practiceRoot, target)) {
    problems.push(`Unsafe reference in ${path.relative(process.cwd(), pathInfoFile)}: ${rawPath}`)
    return
  }
  if (!fs.existsSync(target)) {
    problems.push(`Missing referenced bank: ${path.relative(process.cwd(), target)}`)
    return
  }

  try {
    readJson(target)
    summary.referencedJsonFiles += 1
  } catch (error) {
    problems.push(`Invalid referenced JSON ${path.relative(process.cwd(), target)}: ${error.message}`)
  }
}

walk(practiceRoot, (file) => {
  if (binaryPattern.test(file)) {
    summary.binaryFiles += 1
    return
  }
  if (path.basename(file) !== 'path_info.json') return

  summary.pathInfoFiles += 1
  let rows
  try {
    rows = readJson(file)
  } catch (error) {
    problems.push(`Invalid path_info JSON ${path.relative(process.cwd(), file)}: ${error.message}`)
    return
  }

  for (const rawPath of collectPaths(rows)) {
    validateReference(rawPath, file)
  }
})

if (failOnBinary && summary.binaryFiles > 0) {
  problems.push(`Found ${summary.binaryFiles} doc/docx/pdf files under ${path.relative(process.cwd(), practiceRoot)}`)
}

console.log(JSON.stringify(summary, null, 2))

if (problems.length > 0) {
  console.error(problems.slice(0, 50).join('\n'))
  if (problems.length > 50) console.error(`...and ${problems.length - 50} more`)
  process.exit(1)
}
