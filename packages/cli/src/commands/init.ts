import { Command } from 'commander'
import prompts from 'prompts'

import fs from 'node:fs'

import { logger } from '@/utils/logger'

import { PATH_ADD_COMPONENTS, ASTRA_UI_JSON } from '@/constants'

export const init = new Command()
  .name('init')
  .description('Command to prepare the Astra UI development environment')
  .action(async () => {
    const { rootDirLocatedComponents } = await prompts({
      type: 'text',
      name: 'rootDirLocatedComponents',
      message: 'Where do you want to save your components?',
      initial: 'src'
    })

    const directoryLocatedComponents = `${rootDirLocatedComponents}/${PATH_ADD_COMPONENTS}`

    const checkComponentsDirectoryExists = fs.existsSync(
      directoryLocatedComponents
    )

    if (!checkComponentsDirectoryExists) {
      fs.mkdirSync(directoryLocatedComponents, {
        recursive: true,
      })
    }

    fs.writeFile('./astra-ui.json', ASTRA_UI_JSON, 'utf-8', (error) => {
      if (error) {
        logger.error('An error occurred while creating astra-ui.json file')
        process.exit(-1)
      }
    })

    logger.success('The Astra UI development environment is ready')
  })
