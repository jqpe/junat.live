import React from 'react'
import { useRouter } from 'next/router'
import { cx } from 'cva'
import { motion } from 'framer-motion'
import { RemoveScroll } from 'react-remove-scroll'

import { ToggleButton } from '@junat/ui/components/toggle_button'
import Moon from '@junat/ui/icons/moon.svg'
import Sun from '@junat/ui/icons/sun.svg'

import { useTheme } from '~/hooks/use_theme'
import { translate, useLocale } from '~/i18n'
import { MenuItem } from './item'

export const MenuDrawer = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}) => {
  const navRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()
  const locale = useLocale()
  const t = translate(locale)

  const [checked, setChecked] = React.useState(false)
  const { theme } = useTheme()

  if (theme === 'dark' && checked === false) {
    setChecked(true)
  }
  if (theme === 'light' && checked === true) {
    setChecked(false)
  }

  const onKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        setIsOpen(false)
        const menu: HTMLButtonElement | null = document.querySelector('#menu')
        menu?.focus()
      }
    },
    [isOpen, setIsOpen],
  )

  const onFocusOut = React.useCallback(
    (event: FocusEvent) => {
      const target = event.relatedTarget as HTMLElement | null

      if (target && target.dataset?.['menuItem'] !== 'true') {
        setIsOpen(false)
      }
    },
    [setIsOpen],
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
          visibility: isOpen ? 'visible' : 'hidden',
        }}
        className={cx(
          'backdrop-brightness-110 dark:bg-gray-900 dark:bg-opacity-30',
          'fixed inset-0 top-header-height z-[2] h-full select-none',
          'bg-gray-800 bg-opacity-5 backdrop-blur-lg dark:backdrop-brightness-75',
        )}
      >
        <ul
          className={cx(
            'm-auto flex h-[calc(100%-var(--header-height))] max-w-[500px]',
            'flex-col gap-10 px-[1.875rem] py-9',
          )}
        >
          <MenuItem
            aria-label={t('contactLabel')}
            href="mailto:support@junat.live"
          >
            {t('contact')}
          </MenuItem>
          <MenuItem
            aria-current={router.pathname === '/settings' ? 'page' : 'false'}
            href={'/settings'}
            onClick={() => setIsOpen(false)}
          >
            {t('settings')}
          </MenuItem>

          <li className="mt-auto">
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
              <Sun className="fill-[#000] dark:fill-white" />
              <Moon className="fill-[#000] dark:fill-white" />
            </ToggleButton>
          </li>
        </ul>
      </motion.nav>
    </RemoveScroll>
  )
}
