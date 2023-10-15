import { Command } from 'commander'
import prompts from 'prompts'

import fs from 'node:fs'

import axios from 'axios'

import { getComponentLibraries } from '@/utils/get-component-libraries'
import { installComponentDependencies } from '@/utils/install-component-dependencies'
import { logger } from '@/utils/logger'

import { GITHUB_BASE_URL, GITHUB_ENDPOINT_GET_CODE } from '@/constants'

interface ResponseData {
  content: string
}

export const add = new Command()
  .name('add')
  .description('Command to install a desired Astra UI component')
  .argument('[string]', 'Component name for installation')
  .action(async (componentName) => {
    let componentToInstall = componentName

    if (!componentName) {
      const { selectedComponentName } = await prompts({
        type: 'select',
        name: 'selectedComponentName',
        message: 'Choose a component you want to install:',
        choices: [
          {
            title: 'button',
            value: 'button',
          },
        ],
      })

      componentToInstall = selectedComponentName
    }

    const componentPath = `./src/components/Form/${componentToInstall}/index.tsx`
    const url = `${GITHUB_BASE_URL}/${GITHUB_ENDPOINT_GET_CODE}/${componentPath}`

    const { data } = await axios<ResponseData>(url)

    const componentCode = atob(data.content)

    const librariesFoundComponent = getComponentLibraries(componentCode)
    await installComponentDependencies(librariesFoundComponent)

    fs.writeFileSync(`./src/components/ui/${componentName}.tsx`, componentCode)

    logger.success(
      `Component ${componentName} has been installed successfully`
    )
  })
