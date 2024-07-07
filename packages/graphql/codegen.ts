import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: {
    'https://rata.digitraffic.fi/api/v2/graphql/graphql': {
      headers: { 'accept-encoding': 'gzip' },
    },
  },
  documents: ['./src/**/*.{ts,tsx}'],
  ignoreNoDocuments: true,
  generates: {
    './src/generated/': {
      preset: 'client',
      presetConfig: {
        // This is an unnecessary abstraction that makes working with queries harder,
        // see https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#fragment-masking
        fragmentMasking: false,
      },
      // See https://the-guild.dev/graphql/codegen/docs/guides/react-vue#config-api
      config: {
        // Since GraphQL treats nulls in non-nullable fields as errors, optionals make no sense.
        // By default client preset will insert `?` after every field even if the schema explicitly does not allow nulls.
        // The client preset still generates nulls (in form of an union, e.g. string | null) for nullable fields.
        avoidOptionals: true,
        // Mostly for compability with Typescript isolated modules
        // See :/tooling/typescript/base.json and https://www.typescriptlang.org/tsconfig/#isolatedModules
        useTypeImports: true,
        // Require custom scalars (that Digitraffic uses) to be defined, otherwise error
        strictScalars: true,
        // Custom scalars
        scalars: {
          Date: 'string',
          DateTime: 'string',
        },
      },
    },
  },
}

export default config
