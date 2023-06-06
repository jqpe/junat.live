import type { Locale } from '@typings/common'
import type { ReactNode } from 'react'

import React from 'react'

import { styled, keyframes } from '@junat/design'

import translate from '@utils/translate'

const COUNTER = 'digitraffic-error-resolution-steps' as const

const fadeIn = keyframes({
  '0%': { opacity: 0, transform: 'scale(0.9)' },
  '100%': { opacity: 1, transform: 'scale(1)' }
})

const focus = keyframes({
  '0%': { outlineOffset: '0px' },
  '100%': { outlineOffset: '3px' }
})

export const StyledSection = styled('section', {
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${fadeIn} 500ms`
  },
  background: '$primary200',
  '@dark': {
    background: '$primaryA200',
    border: '1px solid $primary500'
  },
  padding: '$xs',
  borderRadius: '3px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  alignItems: 'start',
  gap: '$xs'
})

export const List = styled('ul', {
  counterReset: COUNTER,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '$xs'
})

export const StyledDetails = (props: {
  children: ReactNode | ReactNode[]
  locale: Locale
}) => {
  const [open, setOpen] = React.useState(false)
  const t = translate(props.locale)

  const Details = styled('details', {
    width: '100%',
    marginLeft: '$xxs',
    userSelect: 'none'
  })

  return (
    <Details open={open} onClick={() => setOpen(!open)}>
      <StyledSummary css={{ '&::marker': { content: open ? '▾' : '▸' } }}>
        {t('errors', 'show')}
      </StyledSummary>
      {props.children}
    </Details>
  )
}

export const StyledPre = styled('pre', {
  fontFamily: 'monospace'
})

const StyledSummary = styled('summary', {
  '&::marker': { content: '▸', fontSize: '24px' },
  '&:focus': {
    outline: '1px solid $secondary600',
    '@media (prefers-reduced-motion: no-preference)': {
      animation: `${focus} 500ms forwards`
    }
  }
})

export const StyledListItem = styled('li', {
  '&::before': {
    display: 'flex',
    marginBottom: '$xxs',
    alignItems: 'center',
    justifyContent: 'center',
    counterIncrement: COUNTER,
    content: `counter(${COUNTER})`,
    padding: '$xxs',
    fontSize: '$mobile-caption',
    background: '$slateGray800',
    color: '$slateGray200',
    borderRadius: '9999px',
    maxWidth: '1rem',
    maxHeight: '1rem'
  }
})

export const StyledButton = styled('button', {
  background: '$primary900',
  color: '$primary100',
  padding: '$xxs $s',
  borderRadius: '9999px',
  '&:hover': {
    cursor: 'pointer'
  }
})
