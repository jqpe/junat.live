import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: {
    'https://rata.digitraffic.fi/api/v2/graphql/graphql': {
      headers: { 'accept-encoding': 'gzip' }
    }
  },
  documents: ['./src/lib/digitraffic/**/*.{ts,tsx}'],
  ignoreNoDocuments: true,
  generates: {
    './src/generated/digitraffic/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false
      },
      config: {
        strictScalars: true,
        scalars: {
          Date: 'string',
          DateTime: 'string'
        }
      }
    }
  }
}

export default config
