import fs from 'node:fs/promises'

export async function emptyFileContent(path: string) {
  await fs.writeFile(path, '')
}
