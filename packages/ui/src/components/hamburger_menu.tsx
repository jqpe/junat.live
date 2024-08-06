import type { Spring, Variants } from 'framer-motion'
import type { GetTranslatedValue } from '@junat/core/i18n'

import React from 'react'
import { motion } from 'framer-motion'

type Props = {
  onOpenChange: (open: boolean) => void
  isOpen: boolean
  t: GetTranslatedValue
}

export const HamburgerMenu = (props: Props) => {
  const { t } = props

  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    props.onOpenChange(!props.isOpen)
  }

  const createAnimatedLine = ({ y, deg }: { y: number; deg: number }) => {
    return (
      <motion.line
        x1="4"
        y1={y}
        x2="20"
        y2={y}
        strokeLinecap="round"
        stroke="white"
        strokeWidth="2"
        custom={{ y, deg, open: props.isOpen }}
        variants={icon}
        animate={['pan', 'rotate']}
        className="stroke-gray-900 dark:stroke-white"
      />
    )
  }

  return (
    <button
      data-menu-item={true}
      id="menu"
      onClick={handleOnClick}
      className="-mr-1.5 flex cursor-pointer p-1.5 focus-visible:outline-offset-0"
      aria-label={t(
        `menu.navbar.${props.isOpen ? 'iconLabelCollapse' : 'iconLabelExpand'}`,
      )}
    >
      <svg
        role="img"
        aria-labelledby="menu"
        className="dark:fill-white"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {createAnimatedLine({ y: 6, deg: -45 })}
        {createAnimatedLine({ y: 16, deg: 45 })}
      </svg>
    </button>
  )
}

const DELAY_BETWEEN_VARIANTS = 0.15

const spring: Spring = {
  type: 'spring',
  bounce: 0,
  mass: 0.2,
  stiffness: 300,
  damping: 20,
}

const icon: Variants = {
  pan: ({ open, y }: { y: number; open: boolean }) => ({
    y1: open ? 12 : y,
    y2: open ? 12 : y,
    transition: {
      delay: open ? 0 : DELAY_BETWEEN_VARIANTS,
      ...spring,
    },
  }),
  rotate: ({ deg, open }: { deg: number; open: boolean }) => ({
    rotate: open ? deg : 0,
    // Use rems instead of a number to not use relative values, framer motion uses percentages by default.
    // Root element is used to work across different zooms, yields 12px (.75 * 16 = 12 = 24/2 = middle of svg viewport)
    originX: open ? '0.75rem' : '0rem',
    originY: open ? '0.75rem' : '0rem',
    transition: {
      delay: open ? DELAY_BETWEEN_VARIANTS : 0,
      ...spring,
    },
  }),
}
