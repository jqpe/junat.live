import type { MapLayerMouseEvent } from 'react-map-gl/maplibre'
import type { TrainLayerHandle } from './train_layer'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { layers, namedFlavor } from '@protomaps/basemaps'
import maplibregl from 'maplibre-gl'
import { Protocol } from 'pmtiles'
import GlMap, { ScaleControl } from 'react-map-gl/maplibre'

import { useTheme } from '@junat/react-hooks'

import { useLocale } from '~/i18n'
import { LayerControl } from './layer_control'
import { RailwayTracksLayer } from './railway_tracks_layer'
import { SelectedTrainPanel } from './selected_train_panel'
import { StationsLayer } from './stations_layer'
import { TrainLayer } from './train_layer'

/* eslint-disable-next-line sonarjs/no-globals-shadowing */
export function Map() {
  const locale = useLocale()
  const trainLayerRef = useRef<TrainLayerHandle>(null)
  const { theme } = useTheme()
  const [detailed, setDetailed] = useState(false)
  const [selectedTrain, setSelectedTrain] = useState<ReturnType<
    TrainLayerHandle['getSelectedTrain']
  > | null>(null)

  useEffect(() => {
    const protocol = new Protocol()
    maplibregl.addProtocol('pmtiles', protocol.tile)

    return () => maplibregl.removeProtocol('pmtiles')
  }, [])

  const mapStyle = useMemo(() => {
    // eslint-disable-next-line sonarjs/no-nested-conditional
    const flavor = detailed ? theme : theme === 'light' ? 'white' : 'black'

    return {
      version: 8 as const,
      glyphs:
        'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
      sprite: `https://protomaps.github.io/basemaps-assets/sprites/v4/${flavor}`,
      sources: {
        protomaps: {
          type: 'vector' as const,
          tiles: ['https://junat.live/tiles/finland/{z}/{x}/{y}.mvt'],
          maxzoom: 15,
        },
      },
      layers: [...layers('protomaps', namedFlavor(flavor), { lang: locale })],
    }
  }, [locale, detailed, theme])

  const onMouseEnter = useCallback((event: MapLayerMouseEvent) => {
    trainLayerRef.current?.onMouseEnter(event)
  }, [])

  const onMouseLeave = useCallback((event: MapLayerMouseEvent) => {
    trainLayerRef.current?.onMouseLeave(event)
  }, [])

  const onSelectedTrainChange = useCallback(
    (
      train: TrainLayerHandle['getSelectedTrain'] extends () => infer R
        ? R
        : never,
    ) => {
      setSelectedTrain(train)
    },
    [],
  )

  return (
    <div className="relative h-dvh w-dvw overflow-clip">
      <GlMap
        initialViewState={{
          longitude: 24.945_831,
          latitude: 60.192_059,
          zoom: 12,
        }}
        minZoom={4.5}
        maxZoom={18}
        style={{
          position: 'absolute',
          inset: 0,
          paddingTop: 'var(--header-height)',
        }}
        attributionControl={false}
        mapStyle={mapStyle}
        interactiveLayerIds={['trains']}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <StationsLayer selectedTrain={selectedTrain} />
        <RailwayTracksLayer />
        <TrainLayer
          ref={trainLayerRef}
          onSelectedTrainChange={onSelectedTrainChange}
        />
        <ScaleControl />
        <LayerControl
          detailed={detailed}
          onToggle={() => setDetailed(detailed => !detailed)}
        />
      </GlMap>

      <SelectedTrainPanel
        selectedTrain={selectedTrain}
        onClose={() => {
          trainLayerRef.current?.clearSelectedTrain()
          setSelectedTrain(null)
        }}
      />
    </div>
  )
}
