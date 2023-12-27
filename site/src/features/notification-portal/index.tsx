import React from 'react'
import { createPortal } from 'react-dom'

type NotificationPortalProps = {
  children: React.ReactNode | React.ReactNode[]
}

const missingElementExpection = () => {
  throw new TypeError(
    'required element with data attribute [data-notification-slot] does not exist'
  )
}

/**
 * Portal component(s) into notification slot
 */
export const NotificationPortal = (props: NotificationPortalProps) => {
  return createPortal(
    props.children,
    document.querySelector('[data-notification-slot="true"]') ||
      missingElementExpection(),
    'notification'
  )
}
