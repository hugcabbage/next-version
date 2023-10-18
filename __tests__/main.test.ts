/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as fs from 'fs'
import * as path from 'path'
import * as core from '@actions/core'
import * as main from '../src/main'

// Read the example tags text
const filePath = path.join(__dirname, 'tags.txt')
const tags = fs.readFileSync(filePath, 'utf8').trim().split('\n')

// Mock the GitHub Actions core library
const getInputMock = jest.spyOn(core, 'getInput')
const setFailedMock = jest.spyOn(core, 'setFailed')
const setOutputMock = jest.spyOn(core, 'setOutput')

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Output a one-bit version number prefixed with v', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'prefix':
          return 'v'
        case 'mode':
          return '1'
        case 'repo_path':
          return '.'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'version',
      expect.stringMatching('^v')
    )
  })

  it('Error thrown: Path error', async () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'prefix':
          return 'v'
        case 'mode':
          return '1'
        case 'repo_path':
          return 'kkk'
        default:
          return ''
      }
    })
    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching('is not a git repository$')
    )
  })

  it('Error thrown: Length value is not a number', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'prefix':
          return 'v'
        case 'mode':
          return 'ppp'
        case 'repo_path':
          return '.'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching('the length cannot be determined$')
    )
  })
})

describe('nextVersion function', () => {
  it('The next one-bit version number is v26', () => {
    expect(main.nextVersion('v', 1, tags)).toBe('v26')
  })
  it('The next two-digit version number is v8.1', () => {
    expect(main.nextVersion('v', 2, tags)).toBe('v8.1')
  })
  it('The next three-digit version number is v18.0.0', () => {
    expect(main.nextVersion('v', 3, tags)).toBe('v18.0.0')
  })
  it('The next four-digit version number is v6.0.0.0', () => {
    expect(main.nextVersion('v', 4, tags)).toBe('v6.0.0.0')
  })
})
