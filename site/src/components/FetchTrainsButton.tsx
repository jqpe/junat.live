import type { HTMLMotionProps } from 'framer-motion'
import { AnimatePresence, motion } from 'framer-motion'

import { useColorScheme } from '@hooks/use_color_scheme'
import { styled, keyframes } from '@config/theme'

const translate = keyframes({
  '0%': { transform: 'translate3d(-500%, -500%, 0)' },
  '100%': { transform: 'translate3d(0, 0, 0)' }
})

const StyledBackground = styled('div', {
  maxWidth: 'inherit',
  position: 'absolute',
  zIndex: 0,
  inset: 0,
  animation: `${translate} 1s`,
  animationIterationCount: 'infinite',
  '@media (prefers-reduced-motion)': {
    animation: 'none'
  }
})

const StyledButton = styled(motion.button, {
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  zIndex: 1,
  border: '1px solid $primary600',
  color: '$primary800',
  padding: '0.3125rem 1.25rem',
  borderRadius: '2rem',
  '&:disabled': {
    cursor: 'not-allowed',
    backgroundColor: '$slateGray100',
    border: '1px solid $primary300'
  },
  '@dark': {
    backgroundColor: '$slateGray900',
    borderColor: '$primary400',
    color: '$primary200',
    '&:disabled': {
      backgroundColor: '$slateGray900',
      borderColor: '$primary800'
    }
  }
})

interface FetchTrainsButtonProps extends HTMLMotionProps<'button'> {
  disabled: boolean
  isLoading: boolean
  handleClick: VoidFunction
  text: string
  loadingText: string
  visible: boolean
}

export default function FetchTrainsButton(props: FetchTrainsButtonProps) {
  // prettier-ignore
  const { visible, handleClick, text, loadingText, isLoading, ...buttonProps } = props
  const { colorScheme } = useColorScheme()

  return (
    <AnimatePresence>
      {visible && (
        <StyledButton
          whileTap={{ scale: isLoading ? 1 : 1.1 }}
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring' }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          onClick={handleClick}
          {...buttonProps}
        >
          <StyledBackground
            style={{ animation: isLoading ? undefined : 'none' }}
          >
            <Background style={colorScheme} />
          </StyledBackground>
          <span style={{ zIndex: 1, position: 'relative' }}>
            {isLoading ? loadingText : text}
          </span>
        </StyledButton>
      )}
    </AnimatePresence>
  )
}

function Background({ style }: { style: 'dark' | 'light' }) {
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
            stopColor={style === 'light' ? '#f6eaff' : '#420071'}
            stopOpacity="1"
            offset="0%"
          ></stop>
          <stop
            stopColor={style === 'light' ? '#fbfbfb' : '#030304'}
            stopOpacity="1"
            offset="100%"
          ></stop>
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
