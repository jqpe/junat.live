import type { ControlPosition, IControl } from 'maplibre-gl'

import { createElement } from 'react'
import { cx } from 'cva'
import { Layers, LayersPlus } from 'lucide-react'
import { renderToStaticMarkup } from 'react-dom/server'
import { useControl } from 'react-map-gl/maplibre'

type LayerControlProps = {
  detailed: boolean
  onToggle: () => void
  position?: ControlPosition
}

const containerStyles = cx('maplibregl-ctrl maplibregl-ctrl-group')

class LayerControlImpl implements IControl {
  #container: HTMLDivElement | null = null
  #button: HTMLButtonElement | null = null
  #detailed: boolean
  #onToggle: () => void

  constructor(detailed: boolean, onToggle: () => void) {
    this.#detailed = detailed
    this.#onToggle = onToggle
  }

  onAdd(): HTMLElement {
    this.#container = document.createElement('div')
    this.#container.className = containerStyles

    this.#button = document.createElement('button')
    this.#button.type = 'button'
    this.#button.className = 'maplibregl-ctrl-icon'
    this.#button.setAttribute('aria-label', 'Toggle layer detail')

    this.#updateIcon()

    this.#button.addEventListener('click', () => {
      this.#onToggle()
    })

    this.#container.append(this.#button)
    return this.#container
  }

  onRemove(): void {
    if (this.#container && this.#container.parentNode) {
      this.#container.remove()
    }
  }

  updateDetailed(detailed: boolean): void {
    this.#detailed = detailed
    this.#updateIcon()
  }

  #updateIcon(): void {
    if (!this.#button) return

    // Clear existing icon
    while (this.#button.firstChild) {
      this.#button.firstChild.remove()
    }

    const iconMarkup = this.#detailed
      ? renderToStaticMarkup(createElement(Layers, { size: 20 }))
      : renderToStaticMarkup(createElement(LayersPlus, { size: 20 }))

    this.#button.innerHTML = iconMarkup
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
