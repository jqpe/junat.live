import { Layer, type LayerProps, Source } from 'react-map-gl/maplibre'

import { theme } from '~/lib/tailwind.css'

export type TrainLayerProps = {
  latitude: number
  longitude: number
}

const routeLayer: LayerProps = {
  type: 'circle',
  id: 'train',
  paint: {
    'circle-color': theme.colors.primary[500],
    'circle-radius': 3,
    'circle-opacity': 1
  }
}

export const TrainLayer = (props: TrainLayerProps) => {
  const getData = () => {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [props.longitude, props.latitude]
      }
    }
  }

  return (
    <Source type="geojson" data={getData()}>
      <Layer {...routeLayer} />
    </Source>
  )
}
