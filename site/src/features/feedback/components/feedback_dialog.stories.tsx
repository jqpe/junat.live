import { Meta, StoryFn } from '@storybook/react'
import { FeedbackDialog } from './feedback_dialog'
import { DialogProvider } from '~/components/dialog'

export const Default: StoryFn = args => {
  return (
    <DialogProvider open>
      <FeedbackDialog
        onSubmit={args.onSubmit}
        feedbackEventData={null}
        feedbackEventFeature="storybook-test"
      />
    </DialogProvider>
  )
}

export default {
  component: Default,
  argTypes: {
    onSubmit: { action: 'onSubmit' }
  }
} satisfies Meta<typeof FeedbackDialog>
