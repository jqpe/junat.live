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
  ':root.dark &': {
    fill: '$slateGray600'
  },
  '&[data-departed="true"]': {
    fill: '$primary600',
    ':root.dark &': {
      fill: '$primary400'
    }
  }
})

export const StyledTime = styled('time', {
  marginLeft: '1rem',
  color: '$primary700',
  ':root.dark &': {
    color: '$primary500'
  }
})

export const StyledCancelled = StyledTime

export const TimeDataCell = styled('td', {
  fontVariantNumeric: 'tabular-nums'
})
