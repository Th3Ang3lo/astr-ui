import { Command } from 'commander'
import prompts from 'prompts'

import { existsSync, promises as fs } from 'node:fs'

import { parse, stringify } from '@/utils/json'
import { handleError } from '@/utils/errors/handle-error'

import { spinner } from '@/lib/spinner'
import { logger } from '@/lib/logger'

import {
  ADD_COMPONENTS_PATH,
  ASTRA_UI_JSON_CONTENT,
  ASTRA_UI_JSON,
} from '@/constants'

const commandName = 'init'
const commandDescription =
  'Command to configure the Astra UI development environment'

const spinnerPrepareEnvironment = spinner()

export const init = new Command()
  .name(commandName)
  .description(commandDescription)
  .action(async () => {
    try {
      await runInitCommand()
    } catch (error) {
      spinnerPrepareEnvironment.fail(error.message)

      handleError(error)
    }
  })

async function runInitCommand() {
  const rootDirComponents = await promptAskingSaveComponent()

  if (!rootDirComponents) {
    throw new Error(
      'You canceled the Astra UI environment preparation process'
    )
  }

  spinnerPrepareEnvironment.text =
    'Preparing environment to add Astra UI components'
  spinnerPrepareEnvironment.start()

  const componentPath = `${rootDirComponents}/${ADD_COMPONENTS_PATH}`

  const checkComponentsDirectoryExists = existsSync(componentPath)

  if (!checkComponentsDirectoryExists) {
    await fs.mkdir(componentPath, {
      recursive: true,
    })
  }

  const astraUIJson = parse(ASTRA_UI_JSON_CONTENT)

  const astraUIConfigFile = stringify({
    ...astraUIJson,
    componentPath,
  })

  await fs.writeFile(ASTRA_UI_JSON, astraUIConfigFile, 'utf-8')

  spinnerPrepareEnvironment.text = 'Astra UI development environment ready to add components'
  spinnerPrepareEnvironment.succeed()

  logger.success(
    'Your development environment is ready to use Astra UI components'
  )
}

async function promptAskingSaveComponent() {
  const response = await prompts({
    type: 'text',
    name: 'rootDirComponents',
    message: 'Where do you want to save your components?',
    initial: 'src',
  })

  return response.rootDirComponents
}
