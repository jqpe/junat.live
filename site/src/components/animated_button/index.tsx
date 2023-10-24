import type { HTMLMotionProps } from 'framer-motion'
import type React from 'react'

import { AnimatePresence, motion } from 'framer-motion'

interface AnimatedButtonProps
  extends React.PropsWithChildren<HTMLMotionProps<'button'>> {
  disabled: boolean
  isLoading: boolean
  handleClick: VoidFunction
  loadingText: string
  visible: boolean
}

export default function AnimatedButton(props: AnimatedButtonProps) {
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
          className={`overflow-hidden relative select-none cursor-pointer z-[1] border-solid border-[1px]
          border-primary-600 text-primary-800 py-[0.3125rem] px-[1.25rem] rounded-full disabled:cursor-not-allowed
          disabled:bg-gray-100 disabled:border-primary-300 dark:bg-gray-900 dark:border-primary-400 dark:text-primary-200
          dark:disabled:bg-gray-900 dark:disabled:border-primary-800 mx-auto font-ui`}
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
            className="max-w-[inherit] absolute z-0 inset-0 animate-translate"
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
            className="[stop-color:theme(colors.primary.200)] dark:[stop-color:theme(colors.primary.800)]"
            stopOpacity="1"
            offset="0%"
          />
          <stop
            className="[stop-color:theme(colors.gray.100)] dark:[stop-color:theme(colors.gray.900)]"
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
