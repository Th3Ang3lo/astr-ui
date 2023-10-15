import { AxiosError } from 'axios'

import { logger } from '@/lib/logger'

import { SERVICE_ERROR_REASON } from '@/constants'

export function handleError(error: unknown) {
  try {
    const instanceError = error as Error

    let errorReason = instanceError.message

    if (error instanceof AxiosError) {
      errorReason = SERVICE_ERROR_REASON

      logger.error(errorReason)
      return
    }

    logger.error(errorReason)
    return
  } finally {
    process.exit(1)
  }
}
