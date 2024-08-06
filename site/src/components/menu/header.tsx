import { cx } from 'cva'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { SITE_NAME } from '@junat/core/constants'

import Train from '@junat/ui/icons/train.svg'
import { HamburgerMenu } from '../animated_hamburger_menu'

export const MenuHeader = ({
  setIsOpen,
  isOpen,
}: {
  setIsOpen: (open: boolean) => void
  isOpen: boolean
}) => {
  const router = useRouter()

  return (
    <header>
      <nav
        className={cx(
          'fixed inset-0 z-[2] flex h-header-height select-none items-center',
          'border-grayA-400 bg-gray-100 bg-opacity-80 backdrop-blur-lg',
          'border-b-[.33px] dark:border-grayA-800 dark:bg-gray-800 dark:bg-opacity-20',
        )}
      >
        <ul className="m-auto flex w-full max-w-[500px] items-center justify-between px-[1.875rem]">
          <li>
            <Link
              onClick={() => setIsOpen(false)}
              aria-current={router.asPath === '/' ? 'page' : 'false'}
              href="/"
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
            <HamburgerMenu onOpenChange={setIsOpen} isOpen={isOpen} />
          </li>
        </ul>
      </nav>
    </header>
  )
}
