import { Command } from 'commander'

import { existsSync } from 'node:fs'

import { promptComponentPath } from './prompts/prompt-component-path'
import { promptBabelConfigPath } from './prompts/prompt-babel-config-path'

import { reanimatedSetupTask } from './tasks/reanimated-setup-task'
import { configSetupTask } from './tasks/config-setup-task'

import { handleError } from '@/utils/handle-error'

export class InitCommand {
  private directoryForAddedComponents = ''
  private babelConfigPath = ''

  public async run() {
    await this.promptAndSetComponentDirectory()
    await this.promptAndValidateBabelConfigPath()

    await this.configureReanimatedSetup()
    await this.configureJsonSetup()
  }

  private async promptAndSetComponentDirectory() {
    const { directoryForAddedComponents } = await promptComponentPath()

    if (!directoryForAddedComponents) {
      handleError(
        'Astr UI development environment initialization process was canceled by you.',
      )
    }

    this.directoryForAddedComponents = directoryForAddedComponents
  }

  private async promptAndValidateBabelConfigPath() {
    const { babelConfigPath } = await promptBabelConfigPath()

    const isBabelFilePresent = existsSync(babelConfigPath)

    if (!isBabelFilePresent) {
      handleError(
        'The babel.config.js file was not found in the path provided.',
      )
    }

    this.babelConfigPath = babelConfigPath
  }

  private async configureReanimatedSetup() {
    await reanimatedSetupTask(this.babelConfigPath)
  }

  private async configureJsonSetup() {
    await configSetupTask({
      directoryForAddedComponents: this.directoryForAddedComponents,
      babelConfigPath: this.babelConfigPath,
    })
  }

  public get componentDirectoryPath() {
    return this.directoryForAddedComponents
  }

  public get currentBabelConfigPath() {
    return this.babelConfigPath
  }
}

const initCommand = new InitCommand()

export const init = new Command()
  .name('init')
  .description(
    'Run the command to initialize the Astr UI development environment',
  )
  .action(() => initCommand.run())
