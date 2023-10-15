import { Command } from 'commander'
import prompts from 'prompts'

import fs from 'node:fs/promises'

import { GITHUB_API } from '@/services/github-api'

import { getOptionsAvailableComponents } from '@/utils/get-options-available-components'
import { getComponentLibraries } from '@/utils/get-component-libraries'
import { installComponentDependencies } from '@/utils/install-component-dependencies'
import { handleEnvironmentError } from '@/utils/errors/handle-environment-error'
import { handleError } from '@/utils/errors/handle-error'
import { parse } from '@/utils/json'

import { spinner } from '@/lib/spinner'
import { logger } from '@/lib/logger'

import {
  GITHUB_ENDPOINT_CONTENT_DIR,
  GITHUB_BRANCH_REF,
  ASTRA_UI_JSON
} from '@/constants'

interface ResponseData {
  content: string
}

const commandName = 'add'
const commandDescription = 'Command to add Astra UI component to your project'

const spinnerAddComponent = spinner()

export const add = new Command()
  .name(commandName)
  .description(commandDescription)
  .argument('[component]', 'Component name for installation')
  .action(async (componentName) => {
    try {
      handleEnvironmentError()

      const componentOptionsAvailable = await getOptionsAvailableComponents()

      let componentToInstall = componentName

      if (!componentName) {
        const { selectedComponentName } = await prompts({
          type: 'select',
          name: 'selectedComponentName',
          message: 'Choose a component you want to install:',
          choices: componentOptionsAvailable.map((component) => {
            return {
              title: component,
              value: component,
            }
          }),
        })

        componentToInstall = selectedComponentName
      }

      if (!componentOptionsAvailable.includes(componentToInstall)) {
        throw new Error('Component not found. Try again')
      }

      spinnerAddComponent.text = `Copying code from component ${componentToInstall} to your project`
      spinnerAddComponent.start()

      const componentPath = `./packages/components/src/${componentToInstall}.tsx`
      const request = `${GITHUB_ENDPOINT_CONTENT_DIR}/${componentPath}?${GITHUB_BRANCH_REF}`

      const { data } = await GITHUB_API.get<ResponseData>(request)

      const componentCode = atob(data.content)

      const librariesFoundComponent = getComponentLibraries(componentCode)
      await installComponentDependencies(librariesFoundComponent)

      const astraUIJsonFile = await fs.readFile(ASTRA_UI_JSON, 'utf-8')
      const componentPathAstraUIJsonFile = parse(astraUIJsonFile).componentPath

      await fs.writeFile(
        `./${componentPathAstraUIJsonFile}/${componentToInstall}.tsx`,
        componentCode
      )

      spinnerAddComponent.succeed()

      logger.success(
        `Component ${componentToInstall} has been successfully added to your project`
      )
    } catch (error) {
      spinnerAddComponent.fail()
      handleError(error)
    }
  })
