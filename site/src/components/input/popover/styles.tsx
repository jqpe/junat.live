/* eslint-disable sonarjs/no-duplicate-string */
import { styled, keyframes, theme } from '@junat/design'
import * as Popover from '@radix-ui/react-popover'

import CloseIcon from '@components/icons/close.svg'
import CirclesHorizontalIcon from '@components/icons/circles_horizontal.svg'

const colors = theme.colors

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(CloseIconpx)' },
  '100%': { opacity: 1, transform: 'translateY(0)' }
})

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' }
})

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' }
})

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' }
})

export const PopoverContent = styled(Popover.Content, {
  borderRadius: 4,
  padding: 20,
  width: 260,
  backgroundColor: '$slateGrayA300',
  backdropFilter: 'blur(20px)',
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',
  '&[data-state="open"]': {
    '&[data-side="top"]': { animationName: slideDownAndFade },
    '&[data-side="right"]': { animationName: slideLeftAndFade },
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
    '&[data-side="left"]': { animationName: slideRightAndFade }
  }
})

export const PopoverArrow = styled(Popover.Arrow, {
  fill: '$slateGray100',
  '@dark': {
    fill: '$slateGray800'
  }
})

export const PopoverClose = styled(Popover.Close, {
  all: 'unset',
  fontFamily: 'inherit',
  position: 'absolute',
  top: 5,
  right: 5,
  display: 'flex',
  cursor: 'pointer',
  transition: 'box-shadow 0.25s ease-in',

  '&:focus': {
    boxShadow: `0 0 0 2px ${theme.colors.slateGray300}`,
    borderRadius: '9999px',
    outline: 'transparent'
  }
})

export const Close = styled(CloseIcon, {
  fill: '$slateGray500'
})

export const CirclesHorizontal = styled(CirclesHorizontalIcon, {
  fill: '$slateGray900'
})

export const Flex = styled('div', { display: 'flex' })

export const IconButton = styled('button', {
  all: 'unset',
  fontFamily: 'inherit',
  borderRadius: '100%',
  height: 35,
  width: 35,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$primary900',
  backgroundColor: '$slateGray300',
  cursor: 'pointer'
})

export const Text = styled('p', {
  margin: 0,
  color: colors.secondary600,
  '@dark': {
    color: colors.secondary400
  },
  fontSize: 15,
  lineHeight: '19px',
  fontWeight: 500
})
