import fs from 'node:fs'
import path from 'node:path'

import { beforeEach, describe, it, vi, expect, afterAll } from 'vitest'

import { PATH_JSON_CONFIG_FILE } from '@/constants'

import { runInitCommand } from './init'

describe('[Init] : Test', () => {
  const configJsonFile = path.resolve(
    __dirname,
    '..',
    '..',
    PATH_JSON_CONFIG_FILE,
  )
  const componentsPath = path.resolve(__dirname, '..', `./components`)

  afterAll(() => {
    vi.clearAllMocks()

    fs.rmSync(configJsonFile)
    fs.rm(componentsPath, { recursive: true, force: true }, () => {})
  })

  beforeEach(() => {
    process.exit = vi.fn()
  })

  it('should create config file and components directory', async () => {
    vi.mock('prompts', () => {
      return {
        default: () => ({
          pathSaveComponents: 'src',
        }),
      }
    })

    await runInitCommand()

    const configJsonFileExists = fs.existsSync(
      path.resolve(__dirname, '..', '..', PATH_JSON_CONFIG_FILE),
    )

    expect(configJsonFileExists).toBeTruthy()
  })
})
