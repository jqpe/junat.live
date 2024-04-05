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
  const navRef = React.useRef<HTMLDivElement>(null)

  const onKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        setIsOpen(false)
        const menu: HTMLButtonElement | null = document.querySelector('#menu')
        menu?.focus()
      }
    },
    [isOpen, setIsOpen]
  )

  const onFocusOut = React.useCallback(
    (event: FocusEvent) => {
      const target = event.relatedTarget as HTMLElement | null

      if (target && target.dataset?.['menuItem'] !== 'true') {
        setIsOpen(false)
      }
    },
    [setIsOpen]
  )

  React.useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    navRef.current?.addEventListener('focusout', onFocusOut)

    return function cleanup() {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusout', onFocusOut)
    }
  }, [onKeyDown, onFocusOut])

  return (
    <RemoveScroll enabled={isOpen}>
      <motion.nav
        ref={navRef}
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
        <ul className="px-[1.875rem] max-w-[500px] m-auto py-9 flex flex-col gap-10">
          <MenuItem href="/contact">Contact</MenuItem>
          <MenuItem href="/settings">Settings</MenuItem>
        </ul>
      </motion.nav>
    </RemoveScroll>
  )
}
