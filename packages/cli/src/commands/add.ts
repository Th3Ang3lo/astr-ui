import { Command } from 'commander'
import prompts from 'prompts'

import fs from 'node:fs/promises'

import { GITHUB_API } from '@/services/github-api'

import { availableComponentOptions } from '@/utils/available-component-options'
import { getComponentLibraries } from '@/utils/get-component-libraries'
import { installComponentDependencies } from '@/utils/install-component-dependencies'
import { getAlreadyAddedComponents } from '@/utils/get-already-added-components'
import { parse } from '@/utils/json'
import { handleError } from '@/utils/handle-error'

import { spinner } from '@/lib/spinner'

import {
  GITHUB_CONTENT_DIR_ENDPOINT,
  GITHUB_BRANCH_REF,
  PATH_JSON_CONFIG_FILE,
} from '@/constants'

interface ResponseData {
  content: string
}

const spinnerAddComponent = spinner()

export const add = new Command()
  .name('add')
  .description('Run the command to add the Astr UI component to your project')
  .argument('[component]', 'Component name for installation')
  .action(async (componentName) => {
    try {
      const availableComponents = await availableComponentOptions()
      const componentsAlreadyAdded = await getAlreadyAddedComponents()

      let componentToAdd = componentName

      if (!componentName) {
        const selectedComponent = await promptSelectComponent(
          availableComponents,
          componentsAlreadyAdded,
        )

        componentToAdd = selectedComponent
      }

      if (typeof componentToAdd !== 'string') {
        throw new Error(
          'Operation cancelled. No components have been added to your project.',
        )
      }

      const isComponentExists = availableComponents.includes(componentToAdd)

      const isComponentAlreadyAdded =
        componentsAlreadyAdded?.includes(componentToAdd)

      if (!isComponentExists) {
        handleError(`Component ${componentToAdd} was not found. Try again.`)
      }

      if (isComponentAlreadyAdded) {
        handleError(
          `Component ${componentToAdd} has already been added to your project.`,
        )
      }

      spinnerAddComponent.start(
        `Adding component ${componentToAdd} code to your project...`,
      )

      const astrDocsComponentPath = `apps/astr-docs/src/components/${componentToAdd}/index.tsx`
      const componentRequestUrl = `${GITHUB_CONTENT_DIR_ENDPOINT}/${astrDocsComponentPath}?${GITHUB_BRANCH_REF}`

      const { data } = await GITHUB_API.get<ResponseData>(componentRequestUrl)

      const componentCode = atob(data.content)

      const librariesFoundComponent = getComponentLibraries(componentCode)
      await installComponentDependencies(librariesFoundComponent)

      const configJsonFile = await fs.readFile(PATH_JSON_CONFIG_FILE, 'utf-8')
      const { componentPath } = parse(configJsonFile)

      await fs.writeFile(
        `./${componentPath}/${componentToAdd}.tsx`,
        componentCode,
      )

      spinnerAddComponent.succeed(
        `Component ${componentToAdd} has been successfully added to your project.`,
      )
    } catch (error) {
      spinnerAddComponent.fail(error.message)
    }
  })

async function promptSelectComponent(
  addComponentOptions: string[],
  componentsAlreadyAdded?: string[],
) {
  const response = await prompts({
    type: 'select',
    name: 'selectedComponent',
    message: 'Select the component you want to add:',
    choices: addComponentOptions.map((component) => {
      const isDisabledComponent = componentsAlreadyAdded?.includes(component)

      return {
        title: component,
        value: component,
        disabled: isDisabledComponent,
      }
    }),
  })

  return response.selectedComponent
}
