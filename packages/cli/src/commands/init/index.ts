import { Command } from 'commander'

import { promptSaveComponents } from './prompts/prompt-save-components'

import { spinner } from '@/utils/spinner'
import { handleError } from '@/utils/handle-error'
import { configSetupFiles } from '@/utils/config-setup-files'

const environmentPreparationLoading = spinner()

export async function executeInitCommand() {
  const { directoryForAddedComponents } = await promptSaveComponents()

  if (!directoryForAddedComponents) {
    handleError(
      'Astr UI development environment initialization process was canceled by you.',
    )
  }

  environmentPreparationLoading.start(
    'Initializing the Astr UI development environment...',
  )

  configSetupFiles(directoryForAddedComponents)

  environmentPreparationLoading.succeed(
    'The Astr UI environment is ready to add components to your project.',
  )
}

export const init = new Command()
  .name('init')
  .description(
    'Run the command to initialize the Astr UI development environment',
  )
  .action(executeInitCommand)
