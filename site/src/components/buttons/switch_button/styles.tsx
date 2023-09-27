import * as Switch from '@radix-ui/react-switch'
import { styled, theme } from '@junat/design'

export const SwitchRoot = styled(Switch.Root, {
  width: 42,
  height: 25,
  backgroundColor: '$slateGray300',
  borderRadius: '9999px',
  position: 'relative',
  boxShadow: `0 2px 5px ${theme.colors.slateGrayA700}`,
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',

  '[data-disabled]': {
    opacity: 0.5,
    pointerEvents: 'none'
  }
})

export const SwitchThumb = styled(Switch.Thumb, {
  display: 'flex',
  width: 24,
  height: 24,
  backgroundColor: 'white',
  borderRadius: '9999px',
  transition: 'transform 100ms',
  willChange: 'transform',
  '&[data-state="checked"]': { transform: 'translateX(19px)' },
  '& svg': {
    transform: 'scale(0.8)'
  }
})

export const Flex = styled('div', { display: 'flex', alignItems: 'center' })
