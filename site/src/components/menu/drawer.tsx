import { RemoveScroll } from 'react-remove-scroll'
import { motion } from 'framer-motion'
import { MenuItem } from './item'
import React from 'react'

export const MenuDrawer = ({
  isOpen,
  setIsOpen
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}) => {
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        const menu: HTMLButtonElement | null = document.querySelector('#menu')
        menu?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', onKeyDown)
    }

    return function cleanup() {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, setIsOpen])

  return (
    <RemoveScroll enabled={isOpen}>
      <motion.div
        aria-hidden={!isOpen}
        initial={{ opacity: 0 }}
        animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
        style={{
          pointerEvents: isOpen ? 'all' : 'none',
          visibility: isOpen ? 'visible' : 'hidden'
        }}
        className="fixed inset-0 h-full top-[42px] dark:bg-gray-900 dark:bg-opacity-30
     bg-gray-800 bg-opacity-5 backdrop-blur-lg backdrop-brightness-110 dark:backdrop-brightness-75 z-40 select-none"
      >
        <div className="px-[1.875rem] max-w-[500px] m-auto py-9 flex flex-col gap-10">
          <MenuItem href="/contact">Contact</MenuItem>
          <MenuItem href="/settings">Settings</MenuItem>
        </div>
      </motion.div>
    </RemoveScroll>
  )
}
