import { Layer, Source } from 'react-map-gl/maplibre'

import { useTheme } from '@junat/react-hooks'

export function RailwayTracksLayer() {
  const { theme } = useTheme()

  return (
    <Source
      id="railway-tracks"
      type="vector"
      url="pmtiles:///railway_tracks.pmtiles"
    >
      <Layer
        id="railway-tracks-line"
        type="line"
        source="railway-tracks"
        source-layer="railway_tracks"
        paint={{
          'line-color': theme === 'dark' ? '#777' : '#aaa',
          'line-width': 1,
        }}
        layout={{
          'line-cap': 'round',
          'line-join': 'round',
        }}
        beforeId="station-circles"
      />
    </Source>
  )
}
