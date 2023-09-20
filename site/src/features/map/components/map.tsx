import { default as MapComponent } from 'react-map-gl/maplibre'
import { style } from '../style'
import React from 'react'

export interface MapProps {
  longitude?: number
  latitude?: number
  zoom?: number
}

export const Map = ({
  longitude = 24.917_191,
  latitude = 60.209_813
}: MapProps) => {
  return (
    <MapComponent
      mapStyle={style}
      style={{ width: '100%', height: '300px' }}
      initialViewState={{ zoom: 15 }}
      minZoom={6}
      latitude={latitude}
      longitude={longitude}
      attributionControl={false}
      transformRequest={(url: string) => {
        if (
          /(api|cdn).digitransit.fi/.test(url) ||
          url.includes('digitransit-prod-cdn-origin.azureedge.net')
        ) {
          return {
            url: url.replace('api.digitransit.fi', 'cdn.digitransit.fi'),
            headers: {
              'digitransit-subscription-key':
                process.env.NEXT_PUBLIC_DIGITRANSIT_KEY
            }
          }
        }
        return {
          url
        }
      }}
    ></MapComponent>
  )
}
