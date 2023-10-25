import { GITHUB_API } from '@/services/github-api'

import {
  GITHUB_BRANCH_REF,
  GITHUB_ENDPOINT_CONTENT_DIR
} from '@/constants'

interface ResponseData {
  name: string
}

export async function getOptionsAvailableComponents (): Promise<string[]> {
  try {
    const request = `/${GITHUB_ENDPOINT_CONTENT_DIR}/packages/components/src?${GITHUB_BRANCH_REF}`

    const { data } = await GITHUB_API.get<ResponseData[]>(request)

    const componentOptionsAvailable = data.map(component => {
      return component.name.split('.')[0]
    })

    return componentOptionsAvailable
  } catch (error) {
    throw new Error(error)
  }
}
