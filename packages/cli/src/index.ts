/**
 * What needs to be done?
 *
 * - [x] Create INIT command to prepare the environment
 * - [ ] Create ADD command to install desired component
 */

import { program } from 'commander'

import { initCommand } from '@/commands/init-command'

function main() {
  program.addCommand(initCommand)

  program.parse()
}

main()
