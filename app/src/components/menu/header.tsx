import { Link, useLocation } from '@tanstack/react-router'
import { cx } from 'cva'

import { SITE_NAME } from '@junat/core/constants'
import { HamburgerMenu } from '@junat/ui/components/hamburger_menu'
import Train from '@junat/ui/icons/train.svg?react'

import { useTranslations } from '~/i18n'

export const MenuHeader = ({
  setIsOpen,
  isOpen,
}: {
  setIsOpen: (open: boolean) => void
  isOpen: boolean
}) => {
  const t = useTranslations()
  const location = useLocation()

  return (
    <header>
      <nav
        className={cx(
          'fixed inset-0 -top-[5rem] z-[2] flex h-[calc(var(--header-height)+5rem)] pt-20',
          'select-none border-grayA-400 bg-transparent backdrop-blur-lg',
          'items-center border-b-[.33px] dark:border-grayA-800',
        )}
      >
        <ul className="m-auto flex w-full max-w-[500px] items-center justify-between px-[1.875rem]">
          <li>
            <Link
              onClick={() => setIsOpen(false)}
              aria-current={location.pathname === '/' ? 'page' : 'false'}
              to="/"
              className={cx(
                'text-md flex items-center gap-1 py-2 font-ui leading-3 tracking-tight',
                'text-gray-900 no-underline outline-none [outline-style:solid]',
                'hover:text-gray-900 focus-visible:text-[initial] focus-visible:outline-1',
                'focus-visible:outline-secondary-500 dark:text-gray-300 dark:hover:text-gray-200',
              )}
            >
              <Train
                width="16"
                height="16"
                viewBox="0 0 24 24"
                className="fill-gray-900 dark:fill-gray-300"
              />
              {SITE_NAME}
            </Link>
          </li>
          <li>
            <HamburgerMenu t={t} onOpenChange={setIsOpen} isOpen={isOpen} />
          </li>
        </ul>
      </nav>
    </header>
  )
}
