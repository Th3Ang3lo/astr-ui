import { logger } from '@/utils/logger'

export function handleError(errorReason: string) {
  logger.error(errorReason)
  process.exit(0)
}
