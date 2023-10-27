import { detect } from '@antfu/ni'

export async function getPackageManager() {
  const packageManager = await detect({
    programmatic: true,
  })

  return packageManager
}
