import { logger } from '@/lib/logger'

export function handleError(errorReason: string) {
  logger.error(errorReason)
  process.exit(0)
}
