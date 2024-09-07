import type { NormalizedTrain } from '@junat/graphql/digitraffic/queries/single_train'

import React from 'react'
import { cx } from 'cva'
import { Layer, Marker, Source } from 'react-map-gl/maplibre'

import { getBearing, getRouteId, getSnappedPoint } from '@junat/core/utils/map'
import { useTrainLocationsSubscription } from '@junat/react-hooks/digitraffic/use_train_location'
import { useRoute } from '@junat/react-hooks/digitransit/use_route'

import { theme } from '~/lib/tailwind.css'

export interface RouteLayerProps {
  train: NormalizedTrain
}

export const RouteLayer = ({ train }: RouteLayerProps) => {
  const markerRef = React.useRef<maplibregl.Marker>(null)

  const id = getRouteId(train)

  const { data: route } = useRoute({
    id,
    apiKey: process.env.NEXT_PUBLIC_DIGITRANSIT_KEY!,
  })

  const locations = useTrainLocationsSubscription({
    trainNumber: train.trainNumber,
    departureDate: train.departureDate,
  })

  const location = locations.at(-1)

  const lineString = route?.[0]?.patterns?.[0]?.geometry

  if (!lineString) return null

  const data = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: lineString?.map(c => [c?.lon, c?.lat] as [number, number]),
    },
  } satisfies GeoJSON.Feature<GeoJSON.Geometry>

  const coords = getSnappedPoint(train, location, data.geometry.coordinates)

  const bearing = coords
    ? (getBearing(lineString as { lat: number; lon: number }[], coords) ?? 0)
    : 0

  console.log(bearing)

  return (
    <Source type="geojson" data={data}>
      <Layer
        type="line"
        paint={{
          'line-color': theme.colors.primary[500],
          'line-width': 3,
          'line-opacity': 1,
        }}
      />
      {coords && (
        <Marker
          ref={markerRef}
          longitude={coords.geometry.coordinates[0]!}
          latitude={coords.geometry.coordinates[1]!}
          anchor="center"
        >
          <div
            className={cx(
              'h-6 w-6 rounded-full bg-gray-900 text-center leading-6',
              'relative text-gray-100',
            )}
          >
            {train.commuterLineID ?? train.trainNumber}
          </div>
        </Marker>
      )}
    </Source>
  )
}
