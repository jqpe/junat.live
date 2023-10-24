import { Meta, StoryObj } from '@storybook/react'
import AnimatedButton from '.'

export const Default: StoryObj<typeof AnimatedButton> = {
  args: {
    disabled: false,
    visible: true,
    loadingText: 'Loading...',
    isLoading: true
  }
}

export default {
  component: AnimatedButton
} satisfies Meta<typeof AnimatedButton>
