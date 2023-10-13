import * as core from '@actions/core'
import { execSync } from 'child_process'

function vCalculate(version: number[]): string {
  const e = version.length
  version[e - 1] += 1

  for (let i = 1; i < e; i++) {
    if (version[i] > 9) {
      version.splice(i, e - i, ...Array(e - i).fill(0))
      version[i - 1] += 1
      break
    }
  }

  for (let i = e - 1; i > 0; i--) {
    if (version[i] > 9) {
      version[i] = 0
      version[i - 1] += 1
    }
  }

  return version.join('.')
}

function nextVersion(
  prefix = 'v',
  mode = 1,
  tags_data: string | undefined = undefined
): string {
  let version: number[] = new Array(mode).fill(0)
  let tags: string[]
  const e = version.length

  if (tags_data !== undefined) {
    tags = tags_data.trim().split('\n')
  } else {
    tags = execSync('git ls-remote --tags --refs origin', { encoding: 'utf8' })
      .trim()
      .split('\n')
  }

  for (const tag of tags) {
    const regex = new RegExp(`^${prefix}`)
    const mtag = tag
      .split('/')
      .slice(-1)[0]
      .replace(regex, '')
      .split('.')
      .map(Number)

    if (mtag.length !== e) {
      continue
    }
    if (mtag.some(x => isNaN(x))) {
      continue
    }

    for (let i = 0; i < e; i++) {
      if (mtag[i] > version[i]) {
        version = mtag
        break
      }
      if (mtag[i] < version[i]) {
        break
      }
    }
  }

  return `${prefix}${vCalculate(version)}`
}

export async function run(): Promise<void> {
  try {
    const prefix = core.getInput('prefix')
    const mode = Number(core.getInput('mode'))
    const repo_path = core.getInput('repo_path')
    process.chdir(repo_path)

    const version = nextVersion(prefix, mode)
    core.setOutput('version', version)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
