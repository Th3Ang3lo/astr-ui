import ora from 'ora'
import chalk, { ColorName } from 'chalk'

export function spinner(label?: string, labelColor?: ColorName) {
  return ora(chalk[labelColor || 'white'](label))
}
