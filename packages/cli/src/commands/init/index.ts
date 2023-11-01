import { Command } from 'commander'

import { existsSync } from 'node:fs'

import { promptComponentPath } from './prompts/prompt-component-path'
import { promptBabelConfigPath } from './prompts/prompt-babel-config-path'

import { reanimatedSetupTask } from './tasks/reanimated-setup-task'
import { configSetupTask } from './tasks/config-setup-task'

import { handleError } from '@/utils/handle-error'

export async function executeInitCommand() {
  const { directoryForAddedComponents } = await promptComponentPath()

  if (!directoryForAddedComponents) {
    handleError(
      'Astr UI development environment initialization process was canceled by you.',
    )
  }

  const { babelConfigPath } = await promptBabelConfigPath()

  const isBabelFilePresent = existsSync(babelConfigPath)

  if (!isBabelFilePresent) {
    handleError('The babel.config.js file was not found in the path provided.')
  }

  await reanimatedSetupTask(babelConfigPath)

  await configSetupTask({
    directoryForAddedComponents,
    babelConfigPath,
  })
}

export const init = new Command()
  .name('init')
  .description(
    'Run the command to initialize the Astr UI development environment',
  )
  .action(executeInitCommand)
