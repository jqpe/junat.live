
import React from 'react'
import { MenuHeader } from './header'
import { MenuDrawer } from './drawer'

export const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <>
      <MenuHeader setIsMenuOpen={setIsMenuOpen} />
      <MenuDrawer isMenuOpen={isMenuOpen} />
    </>
  )
}

