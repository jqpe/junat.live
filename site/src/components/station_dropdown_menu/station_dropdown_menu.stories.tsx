import type { Meta } from '@storybook/react'

import { expect, fireEvent, within } from '@storybook/test'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'next/router'

import * as DropdownMenu from '~/components/dropdown_menu'
import { useFavorites } from '~/hooks/use_favorites'
import { useTimetableType } from '~/hooks/use_timetable_type'
import * as Menu from '.'
import { StationDropdownMenu } from '.'

export const Default = () => {
  const router = useRouter()
  router.locale = 'en'

  const removeFavorite = useFavorites(state => state.removeFavorite)
  removeFavorite('HKI')

  const { setType } = useTimetableType(state => state.actions)
  setType('DEPARTURE')

  return (
    <StationDropdownMenu currentStation="HKI" locale="en" long={1} lat={1} />
  )
}

export default {
  component: StationDropdownMenu,
  decorators: [
    Story => (
      <QueryClientProvider client={new QueryClient()}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  play: async context => {
    const canvas = within(context.canvasElement)
    const body = document.querySelector('body')!
    const trigger = await canvas.findByTestId(DropdownMenu.TRIGGER_TEST_ID)

    const pointerDown = new MouseEvent('pointerdown', { bubbles: true })

    fireEvent(trigger, pointerDown)

    await within(body).findByTestId(DropdownMenu.CONTENT_TEST_ID)

    await assertCanChangeChecked(Menu.FAVOURITES_CHECKBOX_TEST_ID)
    await assertCanChangeChecked(Menu.TIMETABLE_TYPE_CHECKBOX_TEST_ID)

    const menuElement = within(body).queryByTestId(Menu.CONTENT_TEST_ID)

    await expect(menuElement, 'menu element').toBe(null)
  },
} satisfies Meta<typeof StationDropdownMenu>

const keyDown = new KeyboardEvent('keydown', {
  key: 'Enter',
  bubbles: true,
})

/**
 * Asserts the checkbox is unchecked initially, but checked when the user interacts with it.
 */
const assertCanChangeChecked = async (id: string) => {
  const initialState = 'unchecked'
  const body = document.querySelector('body')!

  const checkbox = await within(body).findByTestId(id)

  if (checkbox.dataset.state !== initialState) {
    throw new TypeError(`Should be ${initialState} by default`)
  }

  checkbox.focus(), fireEvent(checkbox, keyDown)

  if (checkbox.dataset.state === initialState) {
    throw new TypeError(`Should not be ${initialState} when keydown`)
  }
}
