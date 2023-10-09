/**
 * The entrypoint for the action.
 */
import { nextVersion } from './main.test'

const repo_path = '.'
process.chdir(repo_path)

console.log(nextVersion('v', 'short'))
console.log(nextVersion('m', 'medium'))
console.log(nextVersion('v', 'long'))
