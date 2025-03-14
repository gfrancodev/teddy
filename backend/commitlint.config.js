module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: ['commitlint-plugin-gitmoji'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'revert', 'ci', 'build', 'wip']
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [2, 'always', 'lower-case'],
    'header-max-length': [2, 'always', 100],
    'scope-case': [2, 'always', 'lower-case'],
    'start-with-gitmoji': [2, 'always']
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^(?<type>\w*)(?:\((?<scope>.*)\))?!?: (?<gitmoji>:\w+:)(?<subject>.*)/,
      headerCorrespondence: ['type', 'scope', 'gitmoji', 'subject']
    }
  }
}
