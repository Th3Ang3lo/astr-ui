import { Command } from 'commander'
import prompts from 'prompts'

import fs from 'node:fs/promises'

import { AxiosError } from 'axios'

import { GITHUB_API } from '@/services/github-api'

import {
  GITHUB_ENDPOINT_CONTENT_DIR,
  GITHUB_BRANCH_REF,
  ENVIRONMENT_ERROR_REASON,
  SERVICE_ERROR_REASON
} from '@/constants'

import { handleEnvironmentError } from '@/utils/handle-environment-error'
import { getOptionsAvailableComponents } from '@/utils/get-options-available-components'
import { getComponentLibraries } from '@/utils/get-component-libraries'
import { installComponentDependencies } from '@/utils/install-component-dependencies'
import { logger } from '@/utils/logger'

/**
 * Refatorar código
 * Disparar error caso não tenha rodado o comando init
 * Adicionar feedback de loading
 * Ajustar função gerenciador de pacote
 */

interface ResponseData {
  content: string
}

const commandName = 'add'
const commandDescription = 'Command to add Astra UI component to your project'

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
          choices: componentOptionsAvailable.map(component => {
            return {
              title: component,
              value: component
            }
          })
        })

        componentToInstall = selectedComponentName
      }

      if (!componentOptionsAvailable.includes(componentToInstall)) {
        throw new Error('Component not found. Try again')
      }

      const componentPath = `./packages/components/src/${componentToInstall}.tsx`
      const request = `${GITHUB_ENDPOINT_CONTENT_DIR}/${componentPath}?${GITHUB_BRANCH_REF}`

      const { data } = await GITHUB_API.get<ResponseData>(request)

      const componentCode = atob(data.content)

      const librariesFoundComponent = getComponentLibraries(componentCode)
      await installComponentDependencies(librariesFoundComponent)

      await fs.writeFile(
          `./src/components/ui/${componentToInstall}.tsx`,
          componentCode,
      )

      logger.success(
        `Component ${componentToInstall} has been installed successfully`
      )
    } catch (error) {
      let errorReason = error.message
      const errorCode = error.code

      if (errorCode === 'ENOENT') {
        errorReason = ENVIRONMENT_ERROR_REASON
      }

      if (error instanceof AxiosError) {
        errorReason = SERVICE_ERROR_REASON
      }

      logger.error(errorReason)
      process.exit(1)
    }
  })
