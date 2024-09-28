import type { SymbolLayer } from 'react-map-gl/maplibre'
import type { Train } from '@junat/digitraffic/types/train'

import { Layer, Source, useMap } from 'react-map-gl/maplibre'

import { getFormattedTime } from '@junat/core'
import { useTheme } from '@junat/react-hooks'
import { useStations } from '@junat/react-hooks/digitraffic/use_stations'

import { translate, useLocale } from '~/i18n'

export const STATION_LAYER_ID = 'station-layer'

const stationLayer = (theme: 'light' | 'dark') =>
  ({
    type: 'symbol',
    paint: {
      'text-color': theme === 'light' ? '#000' : '#fff',
      'icon-color': theme === 'light' ? '#000' : '#fff',
    },
    layout: {
      'icon-image': 'circle',
      'icon-offset': [-10, 0],
      'text-field': ['format', ['get', 'name'], '\n', ['get', 'time']],
      'text-font': ['Noto Sans Medium'],
      'text-offset': [0, 0],
      'text-variable-anchor': ['left', 'center'],
      'text-size':
        // prettier-ignore
        [
        'interpolate',
        ['linear'],
        ['zoom'],
        0, 6,
        14, 14
      ],
      'icon-size':
        // prettier-ignore
        [
      'interpolate',
      ['linear'],
      ['zoom'],
      0, 0,
      14, .5
    ],
    },
  }) satisfies Omit<
    SymbolLayer,
    // id and source are managed by react-map-gl
    'id' | 'source'
  >

export interface TimetableStationsLayerProps {
  rows: Pick<
    Train['timeTableRows'][number],
    'scheduledTime' | 'stationShortCode' | 'liveEstimateTime'
  >[]
}

export const TimetableStationsLayer = (props: TimetableStationsLayerProps) => {
  const stationsQuery = useStations({ t: translate('all') })
  const locale = useLocale()
  const { theme } = useTheme()

  const { current: map } = useMap()

  if (map && !map.hasImage('station')) {
    const image = 'circle'
    const iconUrl = `/icons/${image}.svg`

    const img = new Image(24, 24)
    img.addEventListener('load', () => {
      if (!map.hasImage(image)) {
        map.addImage(image, img, { sdf: true })
      }
    })
    img.addEventListener('error', console.error)
    img.src = iconUrl
  }

  const stations = stationsQuery.data?.filter(station =>
    props.rows
      .map(row => row.stationShortCode)
      .includes(station.stationShortCode),
  )

  if (!stations) return null

  const data = {
    type: 'FeatureCollection',
    features: props.rows.map(row => {
      const station = stations.find(
        code => code.stationShortCode === row.stationShortCode,
      )!

      return {
        type: 'Feature',
        properties: {
          name: station!.stationName[locale],
          time: row.liveEstimateTime
            ? getFormattedTime(row.liveEstimateTime)
            : getFormattedTime(row.scheduledTime),
        },
        geometry: {
          type: 'Point',
          coordinates: [station.longitude, station.latitude],
        },
      }
    }),
  }

  return (
    <Source type="geojson" data={data}>
      <Layer
        id={STATION_LAYER_ID}
        {...stationLayer(theme as 'light' | 'dark')}
      />
    </Source>
  )
}
