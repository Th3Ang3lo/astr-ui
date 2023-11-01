import prompts from 'prompts'

export async function promptBabelConfigPath() {
  const { babelConfigPath } = await prompts({
    type: 'text',
    name: 'babelConfigPath',
    message: 'Please enter the path of your babel.config.js file:',
    initial: 'babel.config.js',
  })

  return {
    babelConfigPath,
  }
}
