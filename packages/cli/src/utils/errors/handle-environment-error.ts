import fs from 'node:fs'

import { ASTRA_UI_JSON, ENVIRONMENT_ERROR_REASON } from '@/constants'

import { parse } from '@/utils/json'

export function handleEnvironmentError() {
  const checkAstraUIJsonFileWasCreated = fs.existsSync(ASTRA_UI_JSON)

  if (!checkAstraUIJsonFileWasCreated) {
    throw new Error(ENVIRONMENT_ERROR_REASON)
  }

  const requiredFileProperties = [
    'componentsPath',
    'components'
  ]

  const astraUIJsonFileParsed = parse(fs.readFileSync(ASTRA_UI_JSON, 'utf-8'))

  for (const fileProperty of requiredFileProperties) {
    if (!astraUIJsonFileParsed.hasOwnProperty(fileProperty)) {
      throw new Error(ENVIRONMENT_ERROR_REASON)
    }
  }
}
