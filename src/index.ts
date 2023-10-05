/**
 * The entrypoint for the action.
 */
import * as core from '@actions/core'
import { nextVersion } from './main'

core.setOutput('version', nextVersion())
