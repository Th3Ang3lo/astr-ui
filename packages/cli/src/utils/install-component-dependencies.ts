import { exec } from 'child_process'

import fs from 'node:fs'
import { promisify } from 'node:util'

import { getPackageManager } from './get-package-manager'

const executor = promisify(exec)

export async function installComponentDependencies(libraries: string[]) {
  const packageManager = await getPackageManager()

  const packageJsonFile = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
  const installedDependencies = Object.keys(packageJsonFile.dependencies)

  for (const library of libraries) {
    if (installedDependencies.includes(library)) {
      continue
    }

    const installationCommand = packageManager === 'npm' ? 'install' : 'add'

    await executor(`${packageManager} ${installationCommand} ${library}`)
  }
}
