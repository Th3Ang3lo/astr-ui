import { existsSync, promises as fs } from 'node:fs'

import { stringify } from '@/utils/json'

import { COMPONENTS_ADD_PATH, CONFIG_JSON_FILE_PATH } from '@/constants'

interface ConfigSetupData {
  directoryForAddedComponents: string
  babelConfigPath: string
}

export async function configSetupTask(data: ConfigSetupData) {
  const { directoryForAddedComponents, babelConfigPath } = data

  const addComponentFullPath = `${directoryForAddedComponents}/${COMPONENTS_ADD_PATH}`

  const isComponentPathPresent = existsSync(addComponentFullPath)
  const isConfigFilePresent = existsSync(CONFIG_JSON_FILE_PATH)

  if (!isComponentPathPresent) {
    await fs.mkdir(addComponentFullPath, {
      recursive: true,
    })
  }

  if (isConfigFilePresent) {
    return
  }

  await fs.writeFile(
    CONFIG_JSON_FILE_PATH,
    stringify({
      componentPath: addComponentFullPath,
      babelConfig: {
        filePath: babelConfigPath,
      },
    }),
    'utf-8',
  )
}
