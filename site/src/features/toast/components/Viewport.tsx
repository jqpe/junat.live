import { ToastViewport } from '@radix-ui/react-toast'
import { styled } from '@config/theme'

export const Viewport = styled(ToastViewport, {
  pointerEvents: 'none',
  padding: '$3',
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
  maxWidth: '100vw'
})
