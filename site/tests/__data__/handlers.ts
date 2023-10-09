import { rest } from 'msw'

export const digitrafficApiStatusSummary = rest.get(
  'https://status.digitraffic.fi/api/v2/summary.json',
  (req, res, ctx) => {
    return res(
      ctx.json({
        components: [
          {
            id: 'nfys4zwym2wz',
            name: 'Rail MQTT',
            status: 'operational'
          },
          {
            id: '9vty2wtf2tdz',
            name: '/api/v1/metadata/stations',
            status: 'operational'
          },
          {
            id: '2m8xs6g8chhd',
            name: 'Rail GraphQL',
            status: 'operational'
          }
        ]
      })
    )
  }
)
