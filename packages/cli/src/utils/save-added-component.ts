import fs from 'node:fs'

import { ASTRA_UI_JSON } from '@/constants'

import { parse, stringify } from '@/utils/json'
import { handleError } from './errors/handle-error'

export function saveAddedComponent(componentToAdd: string) {
  try {
    const astraUIConfigFile = fs.readFileSync(ASTRA_UI_JSON, 'utf-8')

    const pathSaveComponents = parse(astraUIConfigFile).componentPath
    const componentsAlreadyAdded = parse(astraUIConfigFile).components

    if (componentsAlreadyAdded.includes(componentToAdd)) {
      throw new Error('The component has already been added to your project')
    }

    fs.writeFileSync(
      ASTRA_UI_JSON,
      stringify({
        componentPath: pathSaveComponents,
        components: [...componentsAlreadyAdded, componentToAdd],
      }),
    )
  } catch (error) {
    handleError(error)
  }
}
