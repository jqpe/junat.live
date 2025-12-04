import React from 'react'

import { MenuDrawer } from './drawer'
import { MenuHeader } from './header'

export const Menu = ({
  pathname,
  asPath,
}: {
  pathname: string
  asPath: string
}) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <MenuHeader asPath={asPath} isOpen={isOpen} setIsOpen={setIsOpen} />
      <MenuDrawer pathname={pathname} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}
