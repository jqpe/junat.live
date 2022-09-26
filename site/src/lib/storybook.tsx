import { Meta, DecoratorFn } from '@storybook/react'

import { getCssText } from '@junat/design'

import * as styles from '@junat/design/dist/styles'

const DefaultDecorator: DecoratorFn = Story => {
  styles.reset()
  styles.global()

  return (
    <>
      <style>{getCssText()}</style>
      <Story />
    </>
  )
}

/**
 * A simple facade that should be used for all stories.
 *
 * Ensures that CSS globals and reset is used for all stories.
 */
export const createStory = (props: Meta): Meta => {
  const decorators = [
    DefaultDecorator,
    ...(props.decorators ?? [])
  ] as DecoratorFn[]

  return {
    ...props,
    decorators
  }
}
