import type { UseQueryResult } from '@tanstack/react-query'
import type { SimplifiedTrain } from '@typings/simplified_train'
import type { DigitrafficError as ErrorType } from '@junat/digitraffic/base/classes/digitraffic_error'

import { styled } from '@junat/design'
import { keyframes } from '@stitches/react'
import React, { ReactNode } from 'react'
import translate from '@utils/translate'
import { Locale } from '@typings/common'

const COUNTER = 'digitraffic-error-resolution-steps' as const

const fadeIn = keyframes({
  '0%': { opacity: 0, transform: 'scale(0.9)' },
  '100%': { opacity: 1, transform: 'scale(1)' }
})

const focus = keyframes({
  '0%': { outlineOffset: '0px' },
  '100%': { outlineOffset: '3px' }
})

const Section = styled('section', {
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${fadeIn} 500ms`
  },
  background: '$primary200',
  '@dark': {
    background: '$primaryA200',
    border: '1px solid $primary500'
  },
  padding: '$2',
  borderRadius: '3px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  alignItems: 'start',
  gap: '$2'
})

const List = styled('ul', {
  counterReset: COUNTER,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2'
})

const StyledDetails = (props: {
  children: ReactNode | ReactNode[]
  locale: Locale
}) => {
  const [open, setOpen] = React.useState(false)
  const t = translate(props.locale)

  const Details = styled('details', {
    width: '100%',
    marginLeft: '$1',
    userSelect: 'none'
  })

  return (
    <Details open={open} onClick={() => setOpen(!open)}>
      <Summary css={{ '&::marker': { content: open ? '▾' : '▸' } }}>
        {t('errors', 'show')}
      </Summary>
      {props.children}
    </Details>
  )
}

const Pre = styled('pre', {
  fontFamily: 'monospace'
})

const Summary = styled('summary', {
  '&::marker': { content: '▸', fontSize: '24px' },
  '&:focus': {
    outline: '1px solid $secondary600',
    '@media (prefers-reduced-motion: no-preference)': {
      animation: `${focus} 500ms forwards`
    }
  }
})

const ListItem = styled('li', {
  '&::before': {
    display: 'flex',
    marginBottom: '$1',
    alignItems: 'center',
    justifyContent: 'center',
    counterIncrement: COUNTER,
    content: `counter(${COUNTER})`,
    padding: '$1',
    fontSize: '$mobile-caption',
    background: '$slateGray800',
    color: '$slateGray200',
    borderRadius: '9999px',
    maxWidth: '1rem',
    maxHeight: '1rem'
  }
})

const Button = styled('button', {
  background: '$primary900',
  color: '$primary100',
  padding: '$1 $3',
  borderRadius: '9999px',
  '&:hover': {
    cursor: 'pointer'
  }
})

export function DigitrafficError(
  props: UseQueryResult<SimplifiedTrain[], ErrorType> & { locale: Locale }
) {
  const t = translate(props.locale)

  if (props.failureCount > 0 && !props.isError) {
    return <p>{t('errors', 'digitraffic', 'refetching')}</p>
  }

  if (props.isError) {
    return (
      <Section>
        <p>
          {t('errors', 'digitraffic', 'requestError')}: {props.error.statusText}
        </p>
        {Boolean(props.error.body) && (
          <StyledDetails locale={props.locale}>
            <Pre>{props.error.body}</Pre>
          </StyledDetails>
        )}
        <h2>{t('errors', 'digitraffic', 'whatToDo')}</h2>
        <List>
          <ListItem>
            {t('errors', 'digitraffic', 'errorOrigin')}{' '}
            <a href="https://status.digitraffic.fi/">status.digitraffic.fi</a>
          </ListItem>
          <ListItem>{t('errors', 'digitraffic', 'waitOrRetry')}</ListItem>
          <ListItem>
            {t('errors', 'digitraffic', 'lastStraw')}{' '}
            <a href="https://vr.fi">vr.fi</a> {t('or')}{' '}
            <a href="https://hsl.fi">hsl.fi</a>.
          </ListItem>
        </List>
        <Button onClick={() => props.refetch()}>{t('tryAgain')}</Button>
      </Section>
    )
  }
  return null
}
