import { StyledSpinner } from './styles'
import type { ComponentPropsWithoutRef } from 'react'

export type SpinnerProps = ComponentPropsWithoutRef<typeof StyledSpinner>

export const Spinner = (props?: SpinnerProps) => {
  return <StyledSpinner {...props} />
}
