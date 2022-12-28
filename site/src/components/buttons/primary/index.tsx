import type { ComponentProps } from 'react'

import { StyledPrimaryButton } from './styles'

export type PrimaryButtonProps = ComponentProps<typeof StyledPrimaryButton> & {
  as?: unknown
}

export const PrimaryButton = (props: PrimaryButtonProps) => {
  return <StyledPrimaryButton {...props} />
}
