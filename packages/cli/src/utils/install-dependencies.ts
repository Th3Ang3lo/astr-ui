import { exec } from 'child_process'

import { promisify } from 'node:util'

const commandExecutor = promisify(exec)

export async function installDependencies(libraries: string | string[]) {
  const packageManager = 'pnpm'

  let installCmd = `${packageManager} add ${libraries}`

  if (typeof libraries !== 'string') {
    installCmd = `${packageManager} add ${libraries.join(' ')}`
  }

  await commandExecutor(installCmd)
}
