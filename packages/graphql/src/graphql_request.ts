import { GraphQLClient } from 'graphql-request'

import { fetchWithError } from '@junat/digitraffic'

export const client = new GraphQLClient(
  'https://rata.digitraffic.fi/api/v2/graphql/graphql',
  { fetch: fetchWithError },
)

export const betaClient = new GraphQLClient(
  'https://rata-beta.digitraffic.fi/api/v2/graphql/graphql',
  { fetch: fetchWithError },
)

export const digitransitClient = (apiKey: string) => {
  if (!apiKey) throw new TypeError('you need to provide an API key')

  return new GraphQLClient(
    'https://api.digitransit.fi/routing/v1/routers/finland/index/graphql',
    {
      headers: {
        'digitransit-subscription-key': apiKey!,
      },
    },
  )
}
