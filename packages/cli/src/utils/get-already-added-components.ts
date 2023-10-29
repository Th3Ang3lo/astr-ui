import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'

import { parse } from './json'

import { PATH_JSON_CONFIG_FILE } from '@/constants'

export async function getAlreadyAddedComponents() {
  const configFileContent = await fs.readFile(PATH_JSON_CONFIG_FILE, 'utf-8')
  const parsedConfigFileContent = parse(configFileContent)

  const { componentPath } = parsedConfigFileContent

  if (componentPath) {
    const isComponentSaveDirectoryPresent = existsSync(componentPath)

    if (!isComponentSaveDirectoryPresent) {
      await fs.mkdir(componentPath, {
        recursive: true,
      })
    }

    const componentsAddedFiles = await fs.readdir(componentPath)

    const addedComponentsList = componentsAddedFiles.map((componentFile) => {
      return path.parse(componentFile).name
    })

    return addedComponentsList
  }
}
