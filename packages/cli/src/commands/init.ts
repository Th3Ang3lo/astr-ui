import { Command } from 'commander'
import prompts from 'prompts'

import fs from 'node:fs'

import { logger } from '@/utils/logger'

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

    const directoryLocatedComponents = `${rootDirLocatedComponents}/components/ui`

    const checkComponentsDirectoryExists = fs.existsSync(
      directoryLocatedComponents
    )

    if (!checkComponentsDirectoryExists) {
      fs.mkdirSync(directoryLocatedComponents, {
        recursive: true,
      })
    }

    const mapperFileContent = JSON.stringify(
      {
        components: [],
      },
      null,
      1
    )

    fs.writeFile('./astra-ui.json', mapperFileContent, 'utf-8', (error) => {
      if (error) {
        logger.error('An error occurred while creating astra-ui.json file')
        process.exit(-1)
      }
    })

    logger.success('The Astra UI development environment is ready')
  })
