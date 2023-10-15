import fs from 'node:fs'

export function packageManagerDetector() {
  // TODO - Change directories when finished development
  const packageManagers: Record<string, string> = {
    npm: '../../package-lock.json',
    yarn: '../../yarn.lock',
    pnpm: '../../pnpm-lock.yaml',
    // bun: './bun.lockb'
  }

  return Object.keys(packageManagers).find((packageManager) => {
    const lockFile = packageManagers[packageManager]

    if (fs.existsSync(lockFile)) {
      return `${packageManager}`
    }
  })
}
