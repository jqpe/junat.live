import Close from '@components/icons/close.svg'
import { IconButton } from '@components/buttons/icon'

import { StyledAside } from './styles'
import React from 'react'

export type NotificationProps = Parameters<typeof StyledAside>[0]

export const Notification = (props: NotificationProps) => {
  const [visible, setVisible] = React.useState(true)

  if (!visible) {
    return null
  }

  return (
    <StyledAside {...props}>
      <IconButton onClick={() => setVisible(false)}>
        <Close />
      </IconButton>
      {props.children}
    </StyledAside>
  )
}
