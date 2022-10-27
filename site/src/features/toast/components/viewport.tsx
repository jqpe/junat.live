import { ToastViewport } from '@radix-ui/react-toast'
import { styled } from '@junat/design'

export const Viewport = styled(ToastViewport, {
  pointerEvents: 'none',
  padding: '$s',
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
  maxWidth: '100vw'
})
