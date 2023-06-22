import { styled } from '@junat/design'

export const StyledSingleTimetable = styled('table', {
  display: 'flex',
  color: '$slateGray800',
  ':root.dark &': {
    color: '$slateGray200'
  },
  '& tbody': {
    width: '100%'
  }
})
