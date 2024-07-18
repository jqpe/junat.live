/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

import { fileURLToPath } from 'node:url'

/** @type { PrettierConfig | SortImportsConfig } */
const config = {
  semi: false,
  arrowParens: 'avoid',
  singleQuote: true,
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  tailwindConfig: fileURLToPath(
    new URL('../../site/tailwind.config.ts', import.meta.url),
  ),
  tailwindFunctions: ['cx', 'cva'],
  importOrder: [
    '<TYPES>',
    '<TYPES>^@junat',
    '<TYPES>^[.|..|~]',
    '',
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@junat/(.*)$',
    '',
    '^~/',
    '^[../]',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  // Values and types are imported in the same line if version >= 4.5.0
  // E.g. import { type Train, sortTrains } from "cool-pkg", use 4.4.0 to avoid this
  importOrderTypeScriptVersion: '4.4.0',
  overrides: [
    {
      files: '*.json.hbs',
      options: {
        parser: 'json',
      },
    },
    {
      files: '*.js.hbs',
      options: {
        parser: 'babel',
      },
    },
  ],
}

export default config
