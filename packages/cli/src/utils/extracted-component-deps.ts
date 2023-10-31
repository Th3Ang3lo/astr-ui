export function extractedComponentDeps(componentCode: string) {
  const libraryNameRegexPattern = /import\s+.*\s+from\s+['"]([^'"]+)['"]/
  const importRegexPattern = /import .+? from '(?!\.\/|\.\.\/)[^']+'/g

  const importsFound = componentCode.match(importRegexPattern) ?? []
  const dependenciesFound: string[] = []

  for (const _import of importsFound) {
    const dependencyName = _import.match(libraryNameRegexPattern)![1]
    dependenciesFound.push(dependencyName)
  }

  return dependenciesFound
}
