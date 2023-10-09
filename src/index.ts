/**
 * The entrypoint for the action.
 */
import * as core from '@actions/core'
import { nextVersion } from './main'

const prefix = core.getInput('prefix')
const mode = core.getInput('mode')
const repo_path = core.getInput('repo_path')

process.chdir(repo_path)
core.setOutput('version', nextVersion(prefix, mode))
