/// <reference types="node" />

import type { CodegenConfig } from '@graphql-codegen/cli'

if (!('DIGITRANSIT_KEY' in process.env)) {
  throw new TypeError(
    'DIGITRANSIT_KEY not defined; see https://digitransit.fi/en/developers/api-registration/',
  )
}

const config: CodegenConfig = {
  ignoreNoDocuments: true,
  generates: {
    './src/digitraffic/generated/': {
      documents: ['./src/digitraffic/**/*.{ts,tsx}'],
      schema: {
        'https://rata.digitraffic.fi/api/v2/graphql/graphql': {
          headers: { 'accept-encoding': 'gzip' },
        },
      },
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
    './src/digitransit/generated/': {
      documents: ['./src/digitransit/**/*.{ts,tsx}'],
      schema: {
        'https://api.digitransit.fi/routing/v1/routers/finland/index/graphql': {
          headers: {
            'digitransit-subscription-key': process.env.DIGITRANSIT_KEY!,
          },
        },
      },
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        avoidOptionals: true,
        useTypeImports: true,
        strictScalars: true,
        scalars: {
          Long: 'number',
          // https://developers.google.com/maps/documentation/utilities/polylinealgorithm
          Polyline: 'string',
        },
      },
    },
  },
}

export default config
