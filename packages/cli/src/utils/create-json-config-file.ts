import fs from 'node:fs/promises'

import { stringify } from './json'

import { PATH_JSON_CONFIG_FILE } from '@/constants'

interface CreateJsonConfigFileData {
  componentPath: string
}

export async function createJsonConfigFile(data: CreateJsonConfigFileData) {
  await fs.writeFile(PATH_JSON_CONFIG_FILE, stringify(data), 'utf-8')
}
