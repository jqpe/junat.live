import { Meta } from '@storybook/react'
import {
  StationDropdownMenu,
  CHECKBOX_ITEM_TEST_ID,
  TRIGGER_BUTTON_TEST_ID
} from '.'
import { within, fireEvent } from '@storybook/testing-library'
import { useFavorites } from '~/hooks/use_favorites'

export const Default = () => {
  const removeFavorite = useFavorites(state => state.removeFavorite)
  removeFavorite('HKI')

  return (
    <StationDropdownMenu currentStation="HKI" locale="en" long={1} lat={1} />
  )
}

export default {
  component: StationDropdownMenu,
  play: async context => {
    const canvas = within(context.canvasElement)
    const trigger = await canvas.findByTestId(TRIGGER_BUTTON_TEST_ID)

    const pointerDown = new MouseEvent('pointerdown', { bubbles: true })
    const keyDown = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true
    })

    fireEvent(trigger, pointerDown)

    // "escape" the canvas since the content is portaled
    const body = document.querySelector('body')

    if (!body) {
      throw new TypeError('body should exist')
    }

    const checkbox = await within(body).findByTestId(CHECKBOX_ITEM_TEST_ID)

    if (checkbox.dataset.state === 'checked') {
      throw new TypeError('Should not be checked by default')
    }

    checkbox.focus()

    fireEvent(checkbox, keyDown)

    if (checkbox.dataset.state !== 'checked') {
      throw new TypeError('Should be checked when keydown')
    }
  }
} satisfies Meta<typeof StationDropdownMenu>
