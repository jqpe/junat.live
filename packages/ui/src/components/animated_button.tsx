import type { HTMLMotionProps } from 'framer-motion'
import type React from 'react'

import { cx } from 'cva'
import { AnimatePresence, motion } from 'framer-motion'

type ButtonProps = React.PropsWithChildren<HTMLMotionProps<'button'>>

interface AnimatedButtonProps extends ButtonProps {
  disabled: boolean
  isLoading: boolean
  handleClick: () => void
  loadingText: string
  visible: boolean
}

export function AnimatedButton(props: AnimatedButtonProps) {
  const {
    visible,
    handleClick,
    loadingText,
    isLoading,
    children,
    ...buttonProps
  } = props

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className={cx(
            'relative z-[1] mx-auto cursor-pointer select-none overflow-hidden rounded-full',
            'border-[1px] border-solid border-primary-600 px-[1.25rem] py-[0.3125rem] font-ui',
            'disabled:bg-gray-100 dark:border-primary-400 dark:disabled:bg-gray-900',
            'text-primary-800 disabled:cursor-not-allowed disabled:border-primary-300',
            'dark:bg-gray-900 dark:text-primary-200 dark:disabled:border-primary-800',
          )}
          whileTap={{ scale: isLoading ? 1 : 1.1 }}
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring' }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          onClick={handleClick}
          {...buttonProps}
        >
          <div
            className="absolute inset-0 z-0 max-w-[inherit] animate-translate"
            style={{ animation: isLoading ? undefined : 'none' }}
          >
            <Background />
          </div>
          <span style={{ zIndex: 1, position: 'relative' }}>
            {isLoading ? loadingText : children}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

function Background() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 700 700"
      width="700"
      height="700"
    >
      <defs>
        <linearGradient
          gradientTransform="rotate(234, 0.5, 0.5)"
          x1="50%"
          y1="0%"
          x2="50%"
          y2="100%"
          id="gradient"
        >
          <stop
            className={cx(
              '[stop-color:theme(colors.primary.200)]',
              'dark:[stop-color:theme(colors.primary.800)]',
            )}
            stopOpacity="1"
            offset="0%"
          />
          <stop
            className={cx(
              '[stop-color:theme(colors.gray.100)]',
              'dark:[stop-color:theme(colors.gray.900)]',
            )}
            stopOpacity="1"
            offset="100%"
          />
        </linearGradient>
        <filter
          id="filter"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.005 0.006"
            numOctaves="2"
            seed="86"
            stitchTiles="stitch"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            result="turbulence"
          ></feTurbulence>
          <feGaussianBlur
            stdDeviation="31 9"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="turbulence"
            edgeMode="duplicate"
            result="blur"
          ></feGaussianBlur>
          <feBlend
            mode="hard-light"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="SourceGraphic"
            in2="blur"
            result="blend"
          ></feBlend>
        </filter>
      </defs>
      <rect
        width="700"
        height="700"
        fill="url(#gradient)"
        filter="url(#filter)"
      ></rect>
    </svg>
  )
}
