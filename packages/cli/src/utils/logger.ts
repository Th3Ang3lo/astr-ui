import chalk from 'chalk'

export const logger = {
  success(msg: string) {
    console.log(chalk.green(msg))
  },
  warning(msg: string) {
    console.warn(chalk.yellow(msg))
  },
  error(msg: string) {
    console.error(chalk.red(msg))
  }
}
