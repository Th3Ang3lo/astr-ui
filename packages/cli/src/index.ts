import { program } from 'commander'

import { init } from '@/commands/init'
import { add } from '@/commands/add'

function main() {
  program.addCommand(init).addCommand(add)

  program.parse()
}

main()
