import type React from 'react'

import { StyledLink } from './styles'

export type LinkProps = React.ComponentProps<typeof StyledLink>

export const Link = (props: LinkProps) => {
  return <StyledLink {...props} />
}
