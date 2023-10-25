import chalk, { type ColorName } from 'chalk'

export const logger = {
  success (logMessage: string) {
    console.log(chalk.green(logMessage))
  },
  warning (logMessage: string) {
    console.warn(chalk.yellow(logMessage))
  },
  error (logMessage: string) {
    console.error(chalk.red(logMessage))
  },
  common (logMessage: string, logMessageColor: ColorName) {
    console.log(chalk[logMessageColor || 'white'](logMessage))
  }
}
