import MapComponent, {
  FullscreenControl,
  NavigationControl,
  type MapRef
} from 'react-map-gl/maplibre'

import { generateStyle } from 'hsl-map-style'
import 'maplibre-gl/dist/maplibre-gl.css'
import React from 'react'
import { useTheme } from '~/hooks/use_theme'
import { useAnimationFrame } from '~/hooks/use_animation_frame'
import { useEventListener } from '~/hooks/use_event_listener'

type MapProps = {
  longitude?: number
  latitude?: number
  children?: React.ReactNode | React.ReactNode[]
  ticketZones?: boolean
  followCoords?: boolean
}

export function Map(props: MapProps) {
  if (typeof window === 'undefined') {
    throw new TypeError(
      'Component depends on browser APIs at render time and can not be serverside rendered.'
    )
  }

  const map = React.useRef<MapRef>(null)
  const [shouldFollowTrain, setShouldFollowTrain] = React.useState(true)

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

  useAnimationFrame(() => {
    if (props.longitude && props.latitude) {
      map.current?.panTo([props.longitude, props.latitude])
    }
  }, shouldFollowTrain)

  console.log(shouldFollowTrain, map.current)

  useEventListener(map.current?.getCanvas(), 'blur', () => setShouldFollowTrain(true))

  return (
    <MapComponent
      onMouseDown={() => setShouldFollowTrain(false)}
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

