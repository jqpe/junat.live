import MapComponent, {
  FullscreenControl,
  NavigationControl,
  type MapRef
} from 'react-map-gl/maplibre'

import { generateStyle } from 'hsl-map-style'
import 'maplibre-gl/dist/maplibre-gl.css'
import React from 'react'
import { useTheme } from '~/hooks/use_theme'

type MapProps = {
  longitude?: number
  latitude?: number
  children?: React.ReactNode | React.ReactNode[]
  ticketZones?: boolean
}

export function Map(props: MapProps) {
  if (typeof window === 'undefined') {
    throw new TypeError(
      'Component depends on browser APIs at render time and can not be serverside rendered.'
    )
  }

  const map = React.useRef<MapRef>(null)

  const theme = useTheme()

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
    components: {
      ...(props.ticketZones
        ? {
            ticket_zones: { enabled: true },
            ticket_zone_labels: { enabled: true }
          }
        : {}),
      poi: { enabled: true },
      // dark mode
      greyscale: { enabled: theme === 'dark' },
      simplified: { enabled: true }
    }
  })

  return (
    <MapComponent
      // Disable `RTLTextPlugin` as it sends requests to mapbox.com, see https://github.com/visgl/react-map-gl/issues/2310
      RTLTextPlugin={null as unknown as undefined}
      ref={map}
      initialViewState={{
        longitude: props.longitude ?? 24.917_191,
        latitude: props.latitude ?? 60.209_813,
        zoom: 14
      }}
      style={{ width: '100%', height: 300, marginBlock: '10px' }}
      mapStyle={style}
      attributionControl={false}
    >
      <FullscreenControl position="top-right" />
      <NavigationControl position="top-right" />

      {props.children}
    </MapComponent>
  )
}
