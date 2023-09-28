import type { StoryFn } from '@storybook/react'
import type { ComponentPropsWithoutRef } from 'react'

import { SearchBar } from './search_bar'
import React from 'react'

export const Default: StoryFn<
  Partial<ComponentPropsWithoutRef<typeof SearchBar>>
> = args => {
  const [stations, setStations] = React.useState([
    { stationName: { en: 'Helsinki', fi: 'Helsinki', sv: 'Helsinki' } },
    { stationName: { en: 'Ainola', fi: 'Ainola', sv: 'Ainola' } }
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
  argTypes: {
    submitCallback: { action: 'submit', table: { disable: true } },
    changeCallback: { action: 'change', table: { disable: true } },
    stations: { table: { disable: true } }
  }
}
