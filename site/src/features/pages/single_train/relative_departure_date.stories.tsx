import type { Meta, StoryFn } from '@storybook/react'

import { expect, within } from '@storybook/test'
import { addDays } from 'date-fns'

import { withI18n } from '~/../.storybook/utils'
import { RelativeDepartureDate } from './components/relative_departure_date'

const normalize = (value: string) => {
  return /^\d*$/.test(value) ? new Date(+value).toString() : value
}

const Template: StoryFn<typeof RelativeDepartureDate> = props => {
  const departureDate = normalize(props.departureDate)

  return <RelativeDepartureDate {...props} departureDate={departureDate} />
}

const createStory = (daysOffset: number, expectedText: string) => {
  const story = Template.bind({})
  story.args = { departureDate: addDays(new Date(), daysOffset).toString() }
  story.play = async ctx => {
    const canvas = within(ctx.canvasElement)
    const rdd = await canvas.findByTestId(RelativeDepartureDate.testId)
    expect(rdd).toHaveTextContent(expectedText)
  }
  return story
}

export const Tomorrow = createStory(1, 'Tomorrow')
export const TwoDays = createStory(2, 'In 2 days')
export const Yesterday = createStory(-1, 'Yesterday')
export const TwoDaysAgo = createStory(-2, '2 days ago')
export const ToTheFuture = createStory(1200, 'In 1,200 days')
export const ToThePast = createStory(-1200, '1,200 days ago')

export default {
  component: RelativeDepartureDate,
  decorators: [withI18n()],
  args: {
    departureDate: addDays(new Date(), 1).toString(),
  },
  parameters: {
    nextjs: {
      router: {
        locale: 'en',
      },
    },
  },
} satisfies Meta<typeof RelativeDepartureDate>
