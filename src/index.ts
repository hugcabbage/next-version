/**
 * The entrypoint for the action.
 */
import * as core from '@actions/core'
import { nextVersion } from './main'

const prefix = core.getInput('prefix')
const mode = core.getInput('mode')
core.setOutput('version', nextVersion(prefix, mode))
