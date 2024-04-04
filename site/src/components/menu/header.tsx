import Link from 'next/link'
import constants from '~/constants'

import Train from '~/components/icons/train.svg'
import { HamburgerMenu } from '../animated_hamburger_menu'

export const MenuHeader = ({
  setIsMenuOpen
}: {
  setIsMenuOpen: (open: boolean) => void
}) => {
  return (
    <header
      className="h-[42px] flex items-center fixed inset-0 backdrop-blur-lg z-50 bg-gray-800 
  bg-opacity-5 dark:bg-opacity-20 border-b-[.33px] dark:border-grayA-800 border-grayA-400 select-none"
    >
      <ul className="max-w-[500px] px-[1.875rem] w-full m-auto flex justify-between items-center">
        <li>
          <Link
            href="/"
            className="text-md text-gray-800 flex tracking-tight font-ui items-center py-2 gap-1 leading-3 dark:text-gray-300 no-underline hover:text-gray-900 dark:hover:text-gray-200"
          >
            <Train
              width="16"
              height="16"
              viewBox="0 0 24 24"
              className="dark:fill-gray-300 fill-gray-800"
            />
            {constants.SITE_NAME}
          </Link>
        </li>
        <li>
          <HamburgerMenu onOpenChange={setIsMenuOpen} />
        </li>
      </ul>
    </header>
  )
}
