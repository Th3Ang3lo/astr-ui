import { Command } from 'commander'
import prompts from 'prompts'

import fs from 'node:fs'
import { promisify } from 'node:util'

import { exec } from 'child_process'

import { packageManagerDetector } from '@/utils/package-manager-detector'
import { logger } from '@/utils/logger'

interface ResponseData {
  content: string
}

const execAsync = promisify(exec)

const baseUrl = 'https://api.github.com'

export const add = new Command()
  .name('add')
  .description('Command to install a desired Astra UI component')
  .argument('[string]', 'Component name for installation')
  .action(async (componentName) => {
    let componentToInstall = componentName

    if (!componentName) {
      const { selectedComponentName } = await prompts({
        type: 'select',
        name: 'selectedComponentName',
        message: 'Choose a component you want to install:',
        choices: [
          {
            title: 'button',
            value: 'button'
          }
        ]
      })

      componentToInstall = selectedComponentName
    }

    const componentPath = `./src/components/Form/${componentToInstall}/index.tsx`

    const url = `${baseUrl}/repos/lucasaugustsof/icars/contents/${componentPath}`

    const response = await fetch(url)
    const data: ResponseData = await response.json()

    const componentCode = atob(data.content)

    const librariesFoundCode = extractAllCodeLibraries(componentCode)
    await installDependenciesUsedComponents(librariesFoundCode)

    fs.writeFileSync(`./src/components/ui/${componentName}.tsx`, componentCode)

    logger.success(`Component ${componentName} has been installed successfully`)
  })

function extractLibraryNameFromImports(imports: string[]) {
  const regexNameLibrary = /import\s+.*\s+from\s+['"]([^'"]+)['"]/
  const librariesFound: string[] = []

  for (const _import of imports) {
    const nameLibrary = _import.match(regexNameLibrary)![1]

    if (nameLibrary.includes('@')) {
      librariesFound.push(nameLibrary)
    } else {
      const libraryNameWithoutSubdirectory = nameLibrary.split('/')[0]
      librariesFound.push(libraryNameWithoutSubdirectory)
    }
  }

  return librariesFound
}

function extractAllCodeLibraries(code: string) {
  const regexImports = /import .+? from '(?!\.\/|\.\.\/)[^']+'/g
  const importsFound = code.match(regexImports) || []

  const librariesFound = extractLibraryNameFromImports(importsFound)

  return librariesFound
}

async function installDependenciesUsedComponents(libraries: string[]) {
  const packageManager = packageManagerDetector()

  const packageJsonFile = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
  const installedDependencies = Object.keys(packageJsonFile.dependencies)

  for (const library of libraries) {
    if (installedDependencies.includes(library)) {
      continue
    }

    await execAsync(`${packageManager} install ${library}`)
  }
}
