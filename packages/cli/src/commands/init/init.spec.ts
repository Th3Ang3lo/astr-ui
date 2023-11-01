import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'

import { describe, it, expect, vi, beforeAll } from 'vitest'

import { parse } from '@/utils/json'

import { CONFIG_JSON_FILE_PATH } from '@/constants'

import { initCommand } from '.'

const babelConfigContent = `module.exports = function (api) {
  api.cache(true)
  return {
    plugins: [],
  }
}
`

async function deleteFile(path: string) {
  await fs.rm(path)
}

async function deleteDir(path: string) {
  await fs.rmdir(path, {
    recursive: true,
  })
}

describe('CLI Command - Init', () => {
  beforeAll(() => {
    process.exit = vi.fn()

    vi.mock('prompts', () => ({
      default: () => {
        return {
          directoryForAddedComponents: 'src',
          babelConfigPath: 'babel.config.js',
        }
      },
    }))
  })

  it('should return the path to the new components directory', async () => {
    await initCommand.promptAndSetComponentDirectory()

    expect(initCommand.directoryForAddedComponents).toEqual('src')
  })

  it('should be a babel.config.js file in the path passed by the user', async () => {
    await initCommand.promptAndValidateBabelConfigPath()

    await fs.writeFile(initCommand.babelConfigPath, babelConfigContent, 'utf-8')

    const isBabelFilePresent = existsSync(initCommand.babelConfigPath)

    expect(isBabelFilePresent).toBeTruthy()

    await deleteFile(initCommand.babelConfigPath)
  })

  it('should configure the reanimated plugin in the babel.config.js file', async () => {
    await initCommand.promptAndValidateBabelConfigPath()

    await fs.writeFile(initCommand.babelConfigPath, babelConfigContent)

    await initCommand.configureReanimatedSetup()

    const babelConfigFileContent = await fs.readFile(
      initCommand.babelConfigPath,
      'utf-8',
    )

    expect(babelConfigFileContent).toContain('react-native-reanimated/plugin')

    await deleteFile(initCommand.babelConfigPath)
  })

  it('should create astr-ui.json and create the required directories correctly in the user project', async () => {
    await initCommand.configureJsonSetup()

    const isConfigFilePresent = existsSync(CONFIG_JSON_FILE_PATH)

    expect(isConfigFilePresent).toBeTruthy()

    const configFileContent = await fs.readFile(CONFIG_JSON_FILE_PATH, 'utf-8')
    const parsedConfigFileContent = parse(configFileContent)

    const { componentPath } = parsedConfigFileContent

    const isComponentPathPresent = existsSync(componentPath)

    expect(isComponentPathPresent).toBeTruthy()

    await deleteFile(CONFIG_JSON_FILE_PATH)
    await deleteDir(path.resolve(componentPath, '..'))
  })
})
