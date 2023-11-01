import { Command } from 'commander'

import fs from 'node:fs'

import { promptComponentPath } from './prompts/prompt-component-path'
import { promptBabelConfigPath } from './prompts/prompt-babel-config-path'

import { reanimatedSetupTask } from './tasks/reanimated-setup-task'
import { configSetupTask } from './tasks/config-setup-task'

import { handleError } from '@/utils/handle-error'

interface InitCommandProps {
  directoryForAddedComponents: string
  babelConfigPath: string
}

class InitCommand {
  private props: InitCommandProps = {
    directoryForAddedComponents: '',
    babelConfigPath: '',
  }

  get directoryForAddedComponents() {
    return this.props.directoryForAddedComponents
  }

  get babelConfigPath() {
    return this.props.babelConfigPath
  }

  public async promptAndSetComponentDirectory() {
    const { directoryForAddedComponents } = await promptComponentPath()

    if (!directoryForAddedComponents) {
      handleError(
        'Astr UI development environment initialization process was canceled by you.',
      )
    }

    this.props.directoryForAddedComponents = directoryForAddedComponents
  }

  public async promptAndValidateBabelConfigPath() {
    const { babelConfigPath } = await promptBabelConfigPath()

    const isBabelFilePresent = fs.existsSync(babelConfigPath)

    if (!isBabelFilePresent) {
      handleError(
        'The babel.config.js file was not found in the path provided.',
      )
    }

    this.props.babelConfigPath = babelConfigPath
  }

  public async configureReanimatedSetup() {
    await reanimatedSetupTask(this.babelConfigPath)
  }

  public async configureJsonSetup() {
    await configSetupTask({
      directoryForAddedComponents: this.directoryForAddedComponents,
      babelConfigPath: this.babelConfigPath,
    })
  }

  public async execute() {
    await this.promptAndSetComponentDirectory()
    await this.promptAndValidateBabelConfigPath()

    await this.configureReanimatedSetup()
    await this.configureJsonSetup()
  }
}

export const initCommand = new InitCommand()

export const init = new Command()
  .name('init')
  .description(
    'Run the command to initialize the Astr UI development environment',
  )
  .action(() => initCommand.execute())
