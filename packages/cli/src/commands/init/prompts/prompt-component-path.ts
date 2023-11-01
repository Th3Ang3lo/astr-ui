import prompts from 'prompts'

export async function promptComponentPath() {
  const { directoryForAddedComponents } = await prompts({
    type: 'text',
    name: 'directoryForAddedComponents',
    message: 'Where do you want to save the added components?',
    initial: 'src',
  })

  return {
    directoryForAddedComponents,
  }
}
