import type * as React from 'react'
import type { ReactNode } from 'react'
import type * as Stitches from '@stitches/react'
import type { config } from '@junat/design'

import { StyledFloatingActionButton } from './styles'

type FloatingActionButtonElement<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component extends React.ElementType<any> = typeof StyledFloatingActionButton
> = React.ComponentPropsWithoutRef<Component>

type FloatingActionButtonProps<As extends React.ElementType = 'button'> = {
  children: ReactNode | ReactNode[]
  as?: As
  css?: Stitches.CSS<typeof config>
} & FloatingActionButtonElement<As>

export function FloatingActionButton<Component extends React.ElementType>(
  props: FloatingActionButtonProps<Component>
) {
  return (
    <StyledFloatingActionButton type="button" {...props}>
      {props.children}
    </StyledFloatingActionButton>
  )
}
