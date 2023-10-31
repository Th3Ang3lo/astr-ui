import { exec } from 'child_process'

import fs from 'node:fs'
import { promisify } from 'node:util'

import { parse } from '@/utils/json'

const executeCommand = promisify(exec)

export async function installDependencies(
  dependencies: string[],
): Promise<void> {
  const packageManager = 'pnpm'

  const packageJsonFile = parse(fs.readFileSync('./package.json', 'utf-8'))

  if ('dependencies' in packageJsonFile) {
    const installedDependencies = Object.keys(packageJsonFile.dependencies)

    for (const dependency of dependencies) {
      if (installedDependencies.includes(dependency)) {
        continue
      }

      await executeCommand(`${packageManager} install ${dependency}`)
    }
  }
}
