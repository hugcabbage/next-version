/**
 * The entrypoint for the action.
 */
import * as fs from 'fs'
import * as path from 'path'
import { nextVersion } from './main.test'

const repo_path = '.'
process.chdir(repo_path)

// 读取文件内容
const filePath = path.join(__dirname, 'tags.txt')
const text = fs.readFileSync(filePath, 'utf8')
const text_list = text.trim().split('\n')
for (const x of text_list) {
  console.log(x.split('/').slice(-1)[0])
}
console.log('-----------------------')
console.log(nextVersion('v', 1, text))
console.log(nextVersion('v', 2, text))
console.log(nextVersion('v', 3, text))
console.log(nextVersion('v', 4, text))
