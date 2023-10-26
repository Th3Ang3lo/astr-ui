export function getComponentLibraries(componentCode: string) {
  const regexNameLibrary = /import\s+.*\s+from\s+['"]([^'"]+)['"]/
  const regexImports = /import .+? from '(?!\.\/|\.\.\/)[^']+'/g

  const importsFound = componentCode.match(regexImports) ?? []
  const librariesFound: string[] = []

  for (const _import of importsFound) {
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
