import type { ComponentProps } from 'react'

import { StyledLabel } from './styles'

export type LabelProps = ComponentProps<typeof StyledLabel>

export function Label(props: LabelProps) {
  return <StyledLabel {...props} />
}
