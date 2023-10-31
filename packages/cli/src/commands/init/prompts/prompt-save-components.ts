import prompts from 'prompts'

export async function promptSaveComponents() {
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
