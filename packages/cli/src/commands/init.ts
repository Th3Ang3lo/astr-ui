import { Command } from 'commander'
import prompts from 'prompts'

import fs from 'node:fs'

import { logger } from '@/lib/logger'
import { parse, stringify } from '@/utils/json'

import {
  ADD_COMPONENTS_PATH,
  ASTRA_UI_JSON_CONTENT,
  ASTRA_UI_JSON
} from '@/constants'

const commandName = 'init'
const commandDescription = 'Command to configure the Astra UI development environment'

export const init = new Command()
  .name(commandName)
  .description(commandDescription)
  .action(async () => {
    try {
      const { rootDirComponents } = await prompts({
        type: 'text',
        name: 'rootDirComponents',
        message: 'Where do you want to save your components?',
        initial: 'src',
      })

      if (!rootDirComponents) {
        throw new Error('You canceled the Astra UI environment preparation process')
      }

      const componentsPath = `${rootDirComponents}/${ADD_COMPONENTS_PATH}`

      const checkComponentsDirectoryExists = fs.existsSync(componentsPath)

      if (!checkComponentsDirectoryExists) {
        fs.mkdirSync(componentsPath, {
          recursive: true,
        })
      }

      const astraUIJson = parse(ASTRA_UI_JSON_CONTENT)

      const astraUIConfigFile = stringify({
        ...astraUIJson,
        componentsPath
      })

      fs.writeFile(
        ASTRA_UI_JSON,
        astraUIConfigFile,
        'utf-8',
        (error) => {
          if (error) {
            logger.error('An error occurred while creating astra-ui.json file')
            process.exit(1)
          }
        }
      )

      logger.success('Your development environment is ready to use Astra UI components')
    } catch (error) {
      logger.error(error.message)
      process.exit(1)
    }
  })
