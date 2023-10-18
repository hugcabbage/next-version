import * as fs from 'fs'
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

export function nextVersion(
  prefix: string,
  mode: number,
  tags: string[]
): string {
  let version: number[] = new Array(mode).fill(0)
  const e = version.length

  for (const tag of tags) {
    const regPre = new RegExp(`^${prefix}`)
    const mtag = tag
      .split('/')
      .slice(-1)[0]
      .replace(regPre, '')
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
    if (isNaN(mode))
      throw new TypeError(
        `${mode} is not a number, the length cannot be determined`
      )

    const repo = core.getInput('repo_path')
    if (!fs.existsSync(`${repo}/.git`))
      throw new Error(`${repo} is not a git repository`)
    process.chdir(repo)

    const tags = execSync('git ls-remote --tags --refs origin', {
      encoding: 'utf8'
    })
      .trim()
      .split('\n')

    const version = nextVersion(prefix, mode, tags)
    core.setOutput('version', version)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
