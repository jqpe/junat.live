import type { LayoutProps } from '@typings/layout_props'

import dynamic from 'next/dynamic'
import Link from 'next/link'

import { useRouter } from 'next/router'
import constants from '~/constants'
import { useStations } from '~/lib/digitraffic'

import Train from '~/components/icons/train.svg'
import { HamburgerMenu } from '~/components/animated_hamburger_menu'

const Footer = dynamic(() => {
  return import('~/components/footer').then(mod => mod.AppFooter)
})

export default function Page({ children }: LayoutProps) {
  const router = useRouter()
  const { data: stations = [] } = useStations()

  return (
    <div className="m-auto w-[100%]">
      <header className="h-[42px] flex items-center fixed inset-0 backdrop-blur-lg z-50 bg-gray-800 bg-opacity-5 dark:bg-opacity-20 border-b-[.33px] dark:border-grayA-800 border-grayA-400">
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
            <HamburgerMenu onOpenChange={() => {}} />
          </li>
        </ul>
      </header>

      <div className="px-[1.875rem] max-w-[500px] m-auto min-h-screen pt-[50px]">
        {children}
      </div>
      <Footer router={router} stations={stations} />
    </div>
  )
}
