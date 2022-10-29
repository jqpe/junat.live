import { styled } from '@junat/design'

export const StyledTimetableRow = styled('tr', {
  display: 'grid',
  alignItems: 'center',
  gridTemplateColumns: '10% 1fr 1fr',
  marginTop: '$s',
  position: 'relative'
})

export const StyledCircle = styled('circle', {
  fill: '$slateGray500',
  '@dark': {
    fill: '$slateGray600'
  },
  '&[data-departed="true"]': {
    fill: '$primary600',
    '@dark': {
      fill: '$primary400'
    }
  }
})

export const StyledTime = styled('time', {
  marginLeft: '1rem',
  color: '$primary700',
  '@dark': {
    color: '$primary500'
  }
})

export const TimeDataCell = styled('td', {
  fontVariantNumeric: 'tabular-nums'
})
