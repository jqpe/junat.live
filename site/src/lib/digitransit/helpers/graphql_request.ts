import { GraphQLClient } from 'graphql-request'

export const client = new GraphQLClient(
  'https://api.digitransit.fi/routing/v1/routers/finland/index/graphql',
  {
    headers: {
      'digitransit-subscription-key': process.env
        .NEXT_PUBLIC_DIGITRANSIT_KEY as string
    }
  }
)
