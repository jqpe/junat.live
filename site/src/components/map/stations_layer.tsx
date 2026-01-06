import type { LayerProps } from 'react-map-gl/maplibre'

import { useMemo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'

import { useTheme } from '@junat/react-hooks'
import { useStations } from '@junat/react-hooks/digitraffic/use_stations'

import { translate, useLocale } from '~/i18n'

const sharedLayerSettings: Partial<LayerProps> = {
  minzoom: 8,
}

export function StationsLayer() {
  const { theme } = useTheme()
  const locale = useLocale()
  const { data: stations } = useStations({ t: translate('all') })

  const stationsGeoJson = useMemo(() => {
    if (!stations) {
      return {
        type: 'FeatureCollection' as const,
        features: [],
      }
    }

    return {
      type: 'FeatureCollection' as const,
      features: stations
        .filter(s => ('passengerTraffic' in s ? s.passengerTraffic : false))
        .map(station => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [station.longitude, station.latitude],
          },
          properties: {
            name: station.stationName[locale],
            shortCode: station.stationShortCode,
          },
        })),
    }
  }, [stations, locale])

  return (
    <Source id="stations" type="geojson" data={stationsGeoJson}>
      <Layer
        {...sharedLayerSettings}
        id="station-circles"
        type="circle"
        paint={{
          'circle-radius': 3,
          'circle-color': theme === 'dark' ? '#000' : '#fff',
          'circle-stroke-width': 1,
          'circle-stroke-color': theme === 'dark' ? '#fff' : '#000',
        }}
      />
      <Layer
        {...sharedLayerSettings}
        id="station-labels"
        type="symbol"
        layout={{
          'text-field': ['get', 'name'],
          'text-size': 12,
          'text-anchor': 'left',
          'text-offset': [0.5, 0],
          'text-font': ['Noto Sans Regular'],
          'text-optional': true,
        }}
        paint={{
          'text-color': theme === 'dark' ? '#fff' : '#000',
          'text-halo-color': theme === 'dark' ? '#000' : '#fff',
          'text-halo-width': 0.5,
        }}
      />
    </Source>
  )
}
