import { generateStyle } from 'hsl-map-style'

export const style = generateStyle({
  queryParams: [
    {
      url: 'https://api.digitransit.fi/',
      name: 'digitransit-subscription-key',
      value: process.env.NEXT_PUBLIC_DIGITRANSIT_API_KEY
    }
  ]
})
