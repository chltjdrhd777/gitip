import { fixupPluginRules } from '@eslint/compat';
import _import from 'eslint-plugin-import';

export default [
  {
    ignores: ['dist/**/*'],
  },
  {
    plugins: {
      import: fixupPluginRules(_import),
    },

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'object', 'type', 'unknown'],

          pathGroups: [
            {
              pattern: '{react*,react*/**}',
              group: 'builtin',
              position: 'after',
            },
            {
              pattern: '{next*,next*/**}',
              group: 'builtin',
              position: 'after',
            },
            {
              pattern: '{./**/*.styles,../**/*.styles,*.styles}',
              group: 'unknown',
              position: 'after',
            },
            {
              pattern: '*.css',
              group: 'unknown',
              position: 'after',
            },
          ],

          pathGroupsExcludedImportTypes: ['builtin', 'unknown'],
          'newlines-between': 'always',

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];
