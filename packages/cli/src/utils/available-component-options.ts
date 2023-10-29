import { AxiosError } from 'axios'

import { GITHUB_API } from '@/services/github-api'

import { GITHUB_BRANCH_REF, GITHUB_CONTENT_DIR_ENDPOINT } from '@/constants'

interface ResponseData {
  name: string
}

export async function availableComponentOptions(): Promise<string[]> {
  try {
    const astrDocsComponentPath = `/${GITHUB_CONTENT_DIR_ENDPOINT}/apps/astr-docs/src/components?${GITHUB_BRANCH_REF}`

    const { data } = await GITHUB_API.get<ResponseData[]>(astrDocsComponentPath)

    const availableComponents = data.map((component) => {
      return component.name.split('.')[0]
    })

    return availableComponents
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        'An error occurred while connecting to the external service. Please try again.',
      )
    } else {
      throw new Error(error.message)
    }
  }
}
