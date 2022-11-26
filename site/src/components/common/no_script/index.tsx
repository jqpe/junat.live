import type { PropsWithChildren } from 'react'

import { StyledNoScript } from './styles'

export function NoScript(props: PropsWithChildren) {
  return (
    <StyledNoScript>
      <p>{props.children}</p>
    </StyledNoScript>
  )
}

export default NoScript
