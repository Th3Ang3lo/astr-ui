import { logger } from '@/utils/logger'

export function handleError(errorReason: string) {
  if (process.env.NODE_ENV !== 'test') {
    logger.error(errorReason)
  }

  process.exit(0)
}
