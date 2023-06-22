import { styled } from '@junat/design'

export const StyledTimetable = styled('table', {
  textDecoration: 'none',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
})

export const StyledTimetableBody = styled('tbody', {
  display: 'flex',
  flexDirection: 'column'
})

export const StyledTimetableHead = styled('thead', {
  fontSize: '$mobile-caption',
  lineHeight: '$md',
  '@large': {
    fontSize: '$pc-caption'
  },
  color: '$slateGray700',
  ':root.dark &': {
    color: '$slateGray300'
  },
  '@media (max-width: 20rem)': {
    fontSize: 'calc(.5rem + 1vw)'
  }
})

export const StyledTimetableRow = styled('tr', {
  display: 'grid',
  gridTemplateColumns: 'min(35%, 30vw) 1fr 0.4fr 0.4fr',
  gap: '0.5vw'
})

export const CenteredTd = styled('td', {
  display: 'flex',
  justifyContent: 'center'
})
