import type { LayoutProps } from '@typings/layout_props'

import dynamic from 'next/dynamic'
import Link from 'next/link'

import { useRouter } from 'next/router'
import React from 'react'
import { useStations } from '~/lib/digitraffic'

import { AnimatePresence, motion } from 'framer-motion'
import { RemoveScroll } from 'react-remove-scroll'

const Footer = dynamic(() => {
  return import('~/components/footer').then(mod => mod.AppFooter)
})

export default function Page({ children }: LayoutProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const { data: stations = [] } = useStations()

  const MenuLink = ({
    children,
    href
  }: React.PropsWithChildren<{ href: string }>) => {
    return (
      <Link
        onClick={() => setIsMenuOpen(false)}
        className="font-bold text-4xl text-white hover:text-gray-300"
        href={href}
      >
        {children}
      </Link>
    )
  }

  return (
    <div className="m-auto w-[100%]">
      <div className="h-[1.875rem] pt-4 pb-[1.875rem] flex items-center justify-center">
        <div className="px-[1.875rem] w-[min(98%,500px)] bg-transparent flex items-center justify-end fixed z-10text-white">
          <button
            className="font-ui cursor-pointer text-gray-500 focus:outline-offset-1 dark:text-gray-400 rounded-full [backdrop-filter:blur(3px)_invert(.02)] px-4 py-0.5 flex gap-1 items-center"
            onClick={() => setIsMenuOpen(true)}
          >
            Menu
            <svg
              className="fill-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <path d="m12 19.24-4.95-4.95-1.41 1.42L12 22.07l6.36-6.36-1.41-1.42L12 19.24zM5.64 8.29l1.41 1.42L12 4.76l4.95 4.95 1.41-1.42L12 1.93 5.64 8.29z"></path>
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <RemoveScroll>
            <motion.div
              className="fixed inset-0 w-full bg-gray-900 z-50 text-white flex flex-col justify-center items-center gap-12 "
              transition={{
                type: 'spring',
                damping: 30,
                stiffness: 500,
                mass: 0.25
              }}
              initial={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -20 }}
            >
              <button
                onClick={() => setIsMenuOpen(false)}
                className="top-5 right-5 fixed rounded-full flex cursor-pointer"
              >
                <svg
                  className="fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                >
                  <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
                </svg>
              </button>
              <MenuLink href="/">Home</MenuLink>
              <MenuLink href="/about">About</MenuLink>
              <MenuLink href="/contact_us">Contact us</MenuLink>
            </motion.div>
          </RemoveScroll>
        )}
      </AnimatePresence>
      <div className="px-[1.875rem] max-w-[500px] m-auto min-h-screen">
        {children}
      </div>
      <Footer router={router} stations={stations} />
    </div>
  )
}
