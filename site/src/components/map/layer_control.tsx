import type { ControlPosition, IControl, Map as MapLibreMap } from 'maplibre-gl'

import { createElement } from 'react'
import { Layers, LayersPlus } from 'lucide-react'
import { renderToStaticMarkup } from 'react-dom/server'
import { useControl } from 'react-map-gl/maplibre'

type LayerControlProps = {
  detailed: boolean
  onToggle: () => void
  position?: ControlPosition
}

class LayerControlImpl implements IControl {
  _map: MapLibreMap | null = null
  _container: HTMLDivElement | null = null
  _button: HTMLButtonElement | null = null
  _detailed: boolean
  _onToggle: () => void

  constructor(detailed: boolean, onToggle: () => void) {
    this._detailed = detailed
    this._onToggle = onToggle
  }

  onAdd(map: MapLibreMap): HTMLElement {
    this._map = map
    this._container = document.createElement('div')
    this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group'

    this._button = document.createElement('button')
    this._button.type = 'button'
    this._button.className = 'maplibregl-ctrl-icon'
    this._button.setAttribute('aria-label', 'Toggle layer detail')
    this._button.style.width = '29px'
    this._button.style.height = '29px'
    this._button.style.display = 'flex'
    this._button.style.alignItems = 'center'
    this._button.style.justifyContent = 'center'

    this._updateIcon()

    this._button.addEventListener('click', () => {
      this._onToggle()
    })

    this._container.append(this._button)
    return this._container
  }

  onRemove(): void {
    if (this._container && this._container.parentNode) {
      this._container.remove()
    }
    this._map = null
  }

  updateDetailed(detailed: boolean): void {
    this._detailed = detailed
    this._updateIcon()
  }

  _updateIcon(): void {
    if (!this._button) return

    // Clear existing icon
    while (this._button.firstChild) {
      this._button.firstChild.remove()
    }

    const iconMarkup = this._detailed
      ? renderToStaticMarkup(createElement(Layers, { size: 20 }))
      : renderToStaticMarkup(createElement(LayersPlus, { size: 20 }))

    this._button.innerHTML = iconMarkup
  }
}

export function LayerControl({
  detailed,
  onToggle,
  ...opts
}: LayerControlProps) {
  const controlRef = useControl<LayerControlImpl>(
    () => new LayerControlImpl(detailed, onToggle),
    {
      position: 'bottom-right',
      ...opts,
    },
  )

  // Update the control when detailed prop changes
  if (controlRef) {
    controlRef.updateDetailed(detailed)
  }

  return null
}
