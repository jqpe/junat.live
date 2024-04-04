import type { LayoutProps } from '@typings/layout_props'

import dynamic from 'next/dynamic'
import Link from 'next/link'

import { useRouter } from 'next/router'
import constants from '~/constants'
import { useStations } from '~/lib/digitraffic'
import { RemoveScroll } from 'react-remove-scroll'

import { motion } from 'framer-motion'

import Train from '~/components/icons/train.svg'
import { HamburgerMenu } from '~/components/animated_hamburger_menu'
import React, { PropsWithChildren } from 'react'

const Footer = dynamic(() => {
  return import('~/components/footer').then(mod => mod.AppFooter)
})

export default function Page({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
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
            <HamburgerMenu onOpenChange={setIsMenuOpen} />
          </li>
        </ul>
      </header>

      <RemoveScroll enabled={isMenuOpen}>
        <motion.div
          aria-hidden={!isMenuOpen}
          initial={{ opacity: 0 }}
          animate={isMenuOpen ? { opacity: 1 } : { opacity: 0 }}
          style={{
            pointerEvents: isMenuOpen ? 'all' : 'none',
            visibility: isMenuOpen ? 'visible' : 'hidden'
          }}
          className="fixed inset-0 h-full top-[42px] bg-[#000] bg-opacity-70 backdrop-blur-sm z-40"
        >
          <div className="px-[1.875rem] max-w-[500px] m-auto py-9 flex flex-col gap-10">
            <MenuItem href="/contact">Contact</MenuItem>
            <MenuItem href="/settings">Settings</MenuItem>
          </div>
        </motion.div>
      </RemoveScroll>

      <div className="px-[1.875rem] max-w-[500px] m-auto min-h-screen pt-[50px]">
        {children}
      </div>
      <Footer router={router} stations={stations} />
    </div>
  )
}

const MenuItem = (props: PropsWithChildren<{ href: string }>) => {
  return (
    <Link
      className="text-2xl text-gray-200 font-bold tracking-wider decoration-transparent hover:text-white"
      href={props.href}
    >
      {props.children}
    </Link>
  )
}
