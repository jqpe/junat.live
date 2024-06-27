import type { Meta, StoryFn } from '@storybook/react'
import type { ComponentPropsWithoutRef } from 'react'

import React from 'react'
import { userEvent, within } from '@storybook/test'

import { SearchBar } from './search_bar'

export const Default: StoryFn<
  Partial<ComponentPropsWithoutRef<typeof SearchBar>>
> = args => {
  const [stations, setStations] = React.useState([
    { stationName: { en: 'Helsinki', fi: 'Helsinki', sv: 'Helsinki' } },
    { stationName: { en: 'Ainola', fi: 'Ainola', sv: 'Ainola' } },
  ])

  return (
    <>
      <SearchBar
        ariaLabel="Search"
        changeCallback={setStations}
        locale="en"
        placeholder="Search for a station"
        stations={stations}
        submitCallback={() => void 0}
        {...args}
      />
      <p>Check the actions tab</p>
    </>
  )
}

export default {
  component: SearchBar,
  async play(ctx) {
    const canvas = within(ctx.canvasElement)
    const input = await canvas.findByPlaceholderText('Search for a station')
    input.focus()

    await userEvent.type(input, 'Helsinki')
  },
  argTypes: {
    submitCallback: { action: 'submit', table: { disable: true } },
    changeCallback: { action: 'change', table: { disable: true } },
    stations: { table: { disable: true } },
  },
} satisfies Meta<typeof SearchBar>
