import { exec } from 'child_process'

import fs from 'node:fs'
import { promisify } from 'node:util'

const executor = promisify(exec)

export async function installComponentDependencies (libraries: string[]) {
  const packageManager = 'pnpm'

  const packageJsonFile = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
  const installedDependencies = Object.keys(packageJsonFile.dependencies)

  for (const library of libraries) {
    if (installedDependencies.includes(library)) {
      continue
    }

    await executor(`${packageManager} install ${library}`)
  }
}
