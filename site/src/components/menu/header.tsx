import Link from 'next/link'
import { useRouter } from 'next/router'

import constants from '@junat/core/constants'
import Train from '~/components/icons/train.svg'
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
        className="h-[var(--header-height)] flex items-center fixed inset-0 backdrop-blur-lg z-[2] dark:bg-gray-800 
  bg-gray-100 bg-opacity-80 dark:bg-opacity-20 border-b-[.33px] dark:border-grayA-800 border-grayA-400 select-none"
      >
        <ul className="max-w-[500px] px-[1.875rem] w-full m-auto flex justify-between items-center">
          <li>
            <Link
              onClick={() => setIsOpen(false)}
              aria-current={router.asPath === '/' ? 'page' : 'false'}
              href="/"
              className="text-md text-gray-900 flex tracking-tight font-ui items-center py-2 gap-1 leading-3 dark:text-gray-300 no-underline hover:text-gray-900 dark:hover:text-gray-200
              focus-visible:text-[initial] focus-visible:outline-1 focus-visible:outline-secondary-500 [outline-style:solid] outline-none"
            >
              <Train
                width="16"
                height="16"
                viewBox="0 0 24 24"
                className="dark:fill-gray-300 fill-gray-900"
              />
              {constants.SITE_NAME}
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
