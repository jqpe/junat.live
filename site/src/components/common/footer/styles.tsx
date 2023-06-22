import { styled } from '@junat/design'
import Theme from '@components/icons/theme.svg'

const HIGH_CONTRAST = '$slateGray900' as const
const ACCENT = '$slateGray800' as const

const backgroundImage = [
  linearGradient(45, HIGH_CONTRAST, '25%', 'transparent', '20%'),
  linearGradient(-45, HIGH_CONTRAST, '25%', 'transparent', '25%'),
  linearGradient(45, 'transparent', '75%', HIGH_CONTRAST, '75%'),
  linearGradient(-45, 'transparent', '75%', HIGH_CONTRAST, '75%'),
  linearGradient(-45, 'transparent', '', ACCENT, '25%'),
  linearGradient(-45, 'transparent', '', HIGH_CONTRAST, '15%')
].join(',')

export const StyledFooter = styled('footer', {
  marginTop: '3rem',
  padding: '1rem 5vw',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  right: 0,
  left: 0,
  backgroundColor: '$slateGray700',
  color: '$slateGray500',
  fontSize: '$mobile-caption',
  '@large': {
    fontSize: '$pc-caption'
  },
  background: 'linear-gradient($slateGray900, $slateGray900)',
  backgroundImage,
  backgroundSize: '15px 5px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px, -10px 0, 10px 12px',
  '& a': {
    color: '$primary500',
    '&:hover,&:focus': {
      color: '$primary200'
    }
  }
})

function linearGradient(
  d: number,
  color: string,
  colorPos: string,
  color2: string,
  colorPos2: string
) {
  return `linear-gradient(${d}deg, ${color} ${colorPos}, ${color2} ${colorPos2})`
}

export const StyledSelectorsContainer = styled('section', {
  display: 'flex',
  gap: '$m',
  flexWrap: 'wrap'
})

export const StyledThemeIcon = styled(Theme, { fill: '$slateGray200' })
