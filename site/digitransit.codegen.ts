import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: {
    'https://api.digitransit.fi/routing/v1/routers/finland/index/graphql': {
      headers: { 'digitransit-subscription-key': process.env.NEXT_PUBLIC_DIGITRANSIT_KEY as string}
    }
  },
  documents: ['./src/lib/digitransit/**/*.{ts,tsx}'],
  ignoreNoDocuments: true,
  generates: {
    './src/generated/digitransit/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false
      },
      config: {
        strictScalars: true,
        scalars: {
          Date: 'string',
          DateTime: 'string',
          Long: 'number',
          Polyline: 'Array<{lat: number; long: number}>'
        }
      }
    }
  }
}

export default config
