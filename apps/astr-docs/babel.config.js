module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ts', '.tsx', '.jsx', '.js', '.json'],
          alias: {
            '@development-tools': './src/development-tools',
          },
        },
      ],
    ],
  }
}