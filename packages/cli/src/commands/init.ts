import { Command } from 'commander'
import prompts from 'prompts'

import { existsSync, promises as fs } from 'node:fs'

import { createJsonConfigFile } from '@/utils/create-json-config-file'
import { parse } from '@/utils/json'
import { handleError } from '@/utils/handle-error'

import { spinner } from '@/lib/spinner'
import { logger } from '@/lib/logger'

import { PATH_ADD_COMPONENTS, PATH_JSON_CONFIG_FILE } from '@/constants'

const spinnerPrepareEnvironment = spinner()

export const init = new Command()
  .name('init')
  .description(
    'Run the command to initialize the Astr UI development environment',
  )
  .action(runInitCommand)

export async function runInitCommand() {
  await ensureEnvironmentIsConfigured()

  const pathSaveComponents = await promptAskingSaveComponent()

  if (!pathSaveComponents) {
    handleError(
      'Astr UI development environment initialization process was canceled by you.',
    )
  }

  spinnerPrepareEnvironment.start(
    'Initializing the Astr UI development environment...',
  )

  const componentPath = `./${pathSaveComponents}/${PATH_ADD_COMPONENTS}`

  const isComponentSaveDirectoryPresent = existsSync(componentPath)

  if (!isComponentSaveDirectoryPresent) {
    await fs.mkdir(componentPath, {
      recursive: true,
    })
  }

  await createJsonConfigFile({
    componentPath,
  })

  spinnerPrepareEnvironment.succeed(
    'The Astr UI development environment is optimized and ready for you to add\ncomponents to your project.',
  )
}

async function promptAskingSaveComponent() {
  const response = await prompts({
    type: 'text',
    name: 'pathSaveComponents',
    message: 'What is the desired way to store your components?',
    initial: 'src',
  })

  return response.pathSaveComponents
}

async function ensureEnvironmentIsConfigured() {
  const checkConfigFileExists = existsSync(PATH_JSON_CONFIG_FILE)

  if (checkConfigFileExists) {
    const configFileContent = await fs.readFile(PATH_JSON_CONFIG_FILE, 'utf-8')
    const parsedConfigFileContent = parse(configFileContent)

    if ('componentPath' in parsedConfigFileContent) {
      logger.warning(
        'It looks like the Astr UI development environment is already\nconfigured. No need to configure it again.',
      )
      process.exit(0)
    }
  }
}
