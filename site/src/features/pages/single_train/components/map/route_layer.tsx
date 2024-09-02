import type * as maplibregl from 'maplibre-gl'
import type { NormalizedTrain } from '@junat/graphql/digitraffic/queries/single_train'

import React from 'react'

import { getGtfsId } from '@junat/core/utils/map'
import { useRoute } from '@junat/react-hooks/digitransit/use_route'

import { theme } from '~/lib/tailwind.css'

export interface RouteLayerProps {
  map: maplibregl.Map
  train: NormalizedTrain
}

const LAYER_ID = 'train-route'

export const RouteLayer = React.memo<RouteLayerProps>(props => {
  const { train, map } = props

  const getShortCode = (key: 'endTimeTableRow' | 'startTimeTableRow') => {
    return train.compositions[0].journeySections[0][key].station.shortCode
  }

  const id = train
    ? getGtfsId({
        departureShortCode: getShortCode('startTimeTableRow'),
        arrivalShortCode: getShortCode('endTimeTableRow'),
        operatorShortCode: train.operator.shortCode,
        uicCode: +train.operator.uicCode,
        trainType: train.trainType,
        commuterLineId: train.commuterLineID,
        trainNumber: train.trainNumber,
      })
    : null

  const { data: route } = useRoute({
    id,
    apiKey: process.env.NEXT_PUBLIC_DIGITRANSIT_KEY!,
  })

  React.useEffect(() => {
    if (!route) return
    if (map.getSource(LAYER_ID)) return

    map.addSource(LAYER_ID, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route?.[0]?.patterns?.[0]?.geometry?.map(
            (c: { lon: number; lat: number }) => [c.lon, c.lat],
          ),
        },
      },
    })

    map.addLayer({
      source: LAYER_ID,
      type: 'line',
      id: LAYER_ID,
      paint: {
        'line-color': theme.colors.primary[500],
        'line-width': 3,
        'line-opacity': 1,
      },
    })
  }, [route])

  return null
})
