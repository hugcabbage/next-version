import * as fs from 'fs'
import * as path from 'path'

function vcalculate(version: string): string {
  const version_parts = version.split('.').map(Number)
  if (version_parts.length === 1) {
    return String(version_parts[0] + 1)
  }
  if (version_parts.slice(1).some(x => x > 9)) {
    throw new Error('Invalid version number')
  }
  version_parts[version_parts.length - 1] += 1
  for (let i = version_parts.length - 1; i > 0; i--) {
    if (version_parts[i] > 9) {
      version_parts[i] = 0
      version_parts[i - 1] += 1
    }
  }
  return version_parts.join('.')
}

export function nextVersion(prefix = 'v', mode = 'short'): string {
  const filePath = path.join(__dirname, 'tags.txt')
  const tags = fs.readFileSync(filePath, 'utf8').trim().split('\r\n')

  if (tags.length === 0) {
    if (mode === 'medium') {
      return `${prefix}0.1`
    }
    if (mode === 'long') {
      return `${prefix}0.0.1`
    }
    return `${prefix}1`
  }

  let version: number[]
  if (mode === 'medium') {
    version = [0, 0]
  } else if (mode === 'long') {
    version = [0, 0, 0]
  } else {
    version = [0]
  }

  for (const tag of tags) {
    const regex = new RegExp(`^${prefix}`)
    const mtag = tag.split('/').slice(-1)[0].replace(regex, '')
    const mtag_parts = mtag.split('.').map(Number)
    if (mtag_parts.length !== version.length) {
      continue
    }
    if (mtag_parts.some(x => isNaN(x))) {
      continue
    }
    if (mtag_parts > version) {
      version = mtag_parts
    }
  }

  const version_str = version.join('.')
  return `${prefix}${vcalculate(version_str)}`
}
