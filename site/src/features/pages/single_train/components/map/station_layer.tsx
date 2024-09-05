import type { Train } from '@junat/digitraffic/types/train'

import { Layer, Source } from 'react-map-gl/maplibre'

import { getFormattedTime } from '@junat/core'
import { useTheme } from '@junat/react-hooks'
import { useStations } from '@junat/react-hooks/digitraffic/use_stations'

import { translate, useLocale } from '~/i18n'

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
        type="symbol"
        paint={{ 'text-color': theme === 'light' ? '#000' : '#fff' }}
        layout={{
          'text-field': ['format', ['get', 'name'], '\n', ['get', 'time']],
          'text-font': ['Noto Sans Regular'],
          'text-offset': [0, 0],
          'text-variable-anchor': ['left', 'right'],
          'text-size': 14,
        }}
      />
    </Source>
  )
}
