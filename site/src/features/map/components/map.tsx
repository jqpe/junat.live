import MapComponent from 'react-map-gl/maplibre'
import { generateStyle } from 'hsl-map-style'
import 'maplibre-gl/dist/maplibre-gl.css'

const style = generateStyle({
  sourcesUrl: 'https://cdn.digitransit.fi/',
  glyphsUrl: '',
  spriteUrl: '',
  queryParams: [
    {
      url: 'https://cdn.digitransit.fi/',
      name: 'digitransit-subscription-key',
      value: process.env.NEXT_PUBLIC_DIGITRANSIT_KEY
    }
  ],
  components: {}
})

export function Map() {
  return (
    <MapComponent
      initialViewState={{
        longitude: 24.917_191,
        latitude: 60.209_813,
        zoom: 14
      }}
      style={{ width: 550, height: 366 }}
      mapStyle={style}
    />
  )
}
