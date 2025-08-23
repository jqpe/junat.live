import type { Meta, StoryFn } from '@storybook/react'

import { NoScript } from './no_script'

export const Default: StoryFn<typeof NoScript> = () => {
  return (
    <NoScript as="div">
      <p>No JavaScript</p>
    </NoScript>
  )
}

export const WithMenu = () => null

export default {
  component: NoScript,

  argTypes: {
    as: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof NoScript>
