import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import React from 'react'
import { RemoveScroll } from 'react-remove-scroll'

import { MenuItem } from './item'

import Moon from '~/components/icons/moon.svg'
import Sun from '~/components/icons/sun.svg'

import { ToggleButton } from '~/components/toggle_button'

import { getLocale } from '~/utils/get_locale'
import translate from '~/utils/translate'
import { ROUTES } from '~/constants/locales'

export const MenuDrawer = ({
  isOpen,
  setIsOpen
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}) => {
  const navRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()
  const locale = getLocale(router.locale)
  const t = translate(locale)

  const [checked, setChecked] = React.useState(false)

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
    if (typeof window !== 'undefined' && window.__theme === 'dark') {
      setChecked(true)
    }

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
        className="fixed inset-0 h-full top-[var(--header-height)] dark:bg-gray-900 dark:bg-opacity-30
     bg-gray-800 bg-opacity-5 backdrop-blur-lg backdrop-brightness-110 dark:backdrop-brightness-75 z-[2] select-none"
      >
        <ul className="px-[1.875rem] max-w-[500px] m-auto py-9 flex flex-col justify-between h-[calc(100%-var(--header-height))]">
          <div className="flex flex-col gap-10">
            <MenuItem
              aria-label={t('contactLabel')}
              href="mailto:support@junat.live"
            >
              {t('contact')}
            </MenuItem>
            <MenuItem
              aria-current={router.pathname === `/settings` ? 'page' : 'false'}
              href={`/${ROUTES[locale]['settings']}`}
              onClick={() => setIsOpen(false)}
            >
              {t('settings')}
            </MenuItem>
          </div>

          <div>
            <ToggleButton
              aria-label={t(checked ? 'darkMode' : 'lightMode')}
              data-menu-item={true}
              id="menu-theme-toggle"
              checked={checked}
              onCheckedChange={checked => {
                if (typeof window !== 'undefined') {
                  window.__setPreferredTheme(checked ? 'dark' : 'light')
                }

                setChecked(checked)
              }}
            >
              <Sun className="dark:fill-white fill-[#000]" />
              <Moon className="dark:fill-white fill-[#000]" />
            </ToggleButton>
          </div>
        </ul>
      </motion.nav>
    </RemoveScroll>
  )
}
