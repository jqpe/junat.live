import React from 'react'
import { MenuHeader } from './header'
import { MenuDrawer } from './drawer'

export const Menu = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <MenuHeader isOpen={isOpen} setIsOpen={setIsOpen} />
      <MenuDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}
