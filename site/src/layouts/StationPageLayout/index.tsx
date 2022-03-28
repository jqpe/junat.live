import type { ReactChild } from 'react'
import React from 'react'

interface StationPageLayoutProps {
  children: ReactChild | ReactChild[]
}

export default function StationPageLayout({
  children
}: StationPageLayoutProps) {
  if (!React.isValidElement(children)) {
    throw new TypeError(
      'Invalid element passed to StationPageLayout, expected element to be a valid React element.'
    )
  }

  return <>{children}</>
}
