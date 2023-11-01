import { promises as fs } from 'node:fs'

import { emptyFileContent } from '@/utils/empty-file-content'
import { installDependencies } from '@/utils/install-dependencies'
import { parse } from '@/utils/json'
import { spinner } from '@/utils/spinner'

const libraryName = 'react-native-reanimated'
const libraryPlugin = 'react-native-reanimated/plugin'

const reanimatedInstallationLoading = spinner()

export async function reanimatedSetupTask(babelConfigPath: string) {
  const babelConfigFileContent = await fs.readFile(babelConfigPath, 'utf-8')
  const packageJSON = await fs.readFile('./package.json', 'utf-8')

  const { dependencies } = parse(packageJSON)

  const isReanimatedPluginAdded = babelConfigFileContent.includes(libraryPlugin)

  if (!isReanimatedPluginAdded) {
    const reanimatedBabelConfig = babelConfigFileContent.replace(
      /(plugins:)\s*\[/,
      `$1 [\n      '${libraryPlugin}',`,
    )

    emptyFileContent(babelConfigPath)

    await fs.writeFile(babelConfigPath, reanimatedBabelConfig)
  }

  if (!dependencies[libraryName]) {
    reanimatedInstallationLoading.start(
      'Integrating the Reanimated dependency into your project. Wait for the installation to finish.',
    )
    await installDependencies(libraryName)

    reanimatedInstallationLoading.succeed(
      'Reanimated dependency successfully installed in the project.',
    )
  }
}
