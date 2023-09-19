import { styled, theme } from '@junat/design'

export const PopoverButton = styled('button', {
  background: '$slateGray200',
  boxShadow: `0px 0px 3px 0px ${theme.colors.slateGrayA500}`,
  textDecoration: 'none',
  display: 'grid',
  borderRadius: '30px',
  padding: '2px $s',
  fontSize: '13px',
  userSelect: 'none',
  cursor: 'pointer',
  gridTemplateColumns: 'auto 24px',
  '& svg': {
    margin: 'auto'
  },
  '& img': {
    margin: 'auto'
  },

  '@dark': {
    backgroundColor: '$slateGray800',
    boxShadow: `0px 0px 3px 0px ${theme.colors.slateGray600}`,
    '& svg': {
      fill: '$slateGray300'
    },
    '& a:hover': {
      color: 'Orange'
    }
  }
})
