/* eslint-disable sonarjs/no-duplicate-string */

import React from 'react'
import * as maplibregl from 'maplibre-gl'
import layers from 'protomaps-themes-base'

import { useTheme } from '@junat/react-hooks'

import 'maplibre-gl/dist/maplibre-gl.css'

export const Map = () => {
  const { theme } = useTheme()

  React.useLayoutEffect(() => {
    const map = new maplibregl.Map({
      container: 'map',
      attributionControl: {
        customAttribution: '',
      },
      style: {
        version: 8,
        glyphs: 'https://cdn.protomaps.com/fonts/pbf/{fontstack}/{range}.pbf',
        sprite: `https://protomaps.github.io/basemaps-assets/sprites/v3/${theme}`,
        sources: {
          protomaps: {
            type: 'vector',
            url: 'http://tiles.junat.live/finland.json',
            attribution:
              '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
          },
        },
        layers: layers('protomaps', theme),
      },
    })

    map
      .addControl(new maplibregl.ScaleControl())
      .addControl(new maplibregl.GeolocateControl({}))
      .addControl(new maplibregl.NavigationControl())
      .addControl(new maplibregl.FullscreenControl())

    map.on('load', async () => {
      // @ts-expect-error Yes it does fuck off
      const myBounds = map.getSource('protomaps')!.bounds
      map.setMaxBounds(myBounds)

      const result = await fetch(
        'https://rata.digitraffic.fi/api/v1/train-locations.geojson/latest/',
      )
      const data = await result.json()

      map.addSource('train-locations', {
        type: 'geojson',
        data,
      })

      map.addLayer({
        id: 'train-locations',
        type: 'circle',
        source: 'train-locations',
        layout: {},
      })

      map.on('click', 'train-locations', e => {
        console.dir(e)

        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `
            <h2>${e.features![0]!.properties.trainNumber}</h1>
        ${JSON.stringify(e.features![0]!.properties)}
            `,
          )
          .addTo(map)
      })
    })

    return () => map.remove()
  }, [theme])

  return <div id="map" className="h-full w-full" />
}
