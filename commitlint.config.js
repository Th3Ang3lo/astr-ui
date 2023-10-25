module.exports = {
  rules: {
    'header-max-length': [0, 'always', 72],
    'body-leading-blank': [2, 'always'],
    'subject-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'build', // Related to build processes
        'chore', // Maintenance/refactoring tasks, etc.
        'ci', // Continuous integration
        'docs', // Documentation
        'feat', // A new feature
        'fix', // A bug fix
        'perf', // Performance improvement
        'refactor', // Code change that neither fixes a bug nor adds a feature
        'revert', // Reverting previous commits
        'style', // Changes that do not affect code logic (whitespace, formatting, etc.)
        'test', // Adding tests or correcting tests
      ],
    ],
  },
};
