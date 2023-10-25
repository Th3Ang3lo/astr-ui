import ora from 'ora'
import chalk, { type ColorName } from 'chalk'

export function spinner (label?: string, labelColor?: ColorName) {
  return ora(chalk[labelColor ?? 'white'](label))
}
