import { execSync } from 'child_process'

export function nextVersion(): string {
  // Get all tags
  const tags = execSync('git tag').toString().trim().split('\n')
  if (tags.length === 0) {
    // If there is no tag, return v1 as the next version number
    return 'v1'
  }
  //Parse version number
  let version = 0
  for (const tag of tags) {
    const tagVersionStr = tag.replace('v', '')
    const tagVersion = parseInt(tagVersionStr, 10)
    if (!isNaN(tagVersion) && tagVersion > version) {
      version = tagVersion
    }
  }
  version += 1

  return `v${version}`
}
