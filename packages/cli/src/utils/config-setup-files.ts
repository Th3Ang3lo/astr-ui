import { existsSync, promises as fs } from 'node:fs'

import { stringify } from './json'

import { CONFIG_JSON_FILE_PATH, COMPONENTS_ADD_PATH } from '@/constants'

export async function configSetupFiles(componentPath: string) {
  const isConfigFilePresent = existsSync(CONFIG_JSON_FILE_PATH)

  if (isConfigFilePresent) return

  const addedComponentsSavePath = `${componentPath}/${COMPONENTS_ADD_PATH}`

  await fs.writeFile(
    CONFIG_JSON_FILE_PATH,
    stringify({
      componentPath: addedComponentsSavePath,
    }),
    'utf-8',
  )

  const isComponentsSaveDir = existsSync(addedComponentsSavePath)

  if (!isComponentsSaveDir) {
    await fs.mkdir(addedComponentsSavePath, {
      recursive: true,
    })
  }
}
