import React from 'react'

import { MenuDrawer } from './drawer'
import { MenuHeader } from './header'

export const Menu = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <MenuHeader isOpen={isOpen} setIsOpen={setIsOpen} />
      <MenuDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}
