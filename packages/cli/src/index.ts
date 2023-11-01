#!/usr/bin/env node

import { program } from 'commander'

import { init } from '@/commands/init'

function main() {
  program.addCommand(init)

  program.parse()
}

main()
