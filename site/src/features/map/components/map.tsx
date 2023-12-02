import MapComponent from 'react-map-gl/maplibre'
import { generateStyle } from 'hsl-map-style'
import 'maplibre-gl/dist/maplibre-gl.css'
import React from 'react'

type MapProps = {
  longitude?: number
  latitude?: number
  children?: React.ReactNode | React.ReactNode[]
  ticketZones?: boolean
}

export function Map(props: MapProps) {
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
      greyscale: { enabled: false },
      simplified: { enabled: true }
    }
  })
  return (
    <MapComponent
      initialViewState={{
        longitude: props.longitude ?? 24.917_191,
        latitude: props.latitude ?? 60.209_813,
        zoom: 14
      }}
      style={{ width: '100%', height: 300, marginBlock: '10px' }}
      mapStyle={style}
    >
      {props.children}
    </MapComponent>
  )
}
