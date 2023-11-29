import type { LayoutProps } from '@typings/layout_props'

import dynamic from 'next/dynamic'
import Link from 'next/link'

import { useRouter } from 'next/router'
import React from 'react'
import { useStations } from '~/lib/digitraffic'

import Menu from '~/components/icons/menu.svg'
import Close from '~/components/icons/close.svg'

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
        <div className=" w-[min(98%,500px)] bg-transparent flex items-center justify-end fixed z-10 top-4 right-4">
          <button
            className="cursor-pointer focus:outline-offset-1 rounded-full [backdrop-filter:blur(3px)_invert(.02)] px-4 py-4 flex border-[1px] border-grayA-200"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="dark:fill-white" />
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
                <Close className="fill-white" />
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
