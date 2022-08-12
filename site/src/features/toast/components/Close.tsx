import { ToastClose } from '@radix-ui/react-toast'
import { styled } from '@config/theme'

export const Close = styled(ToastClose, {
  right: '0',
  display: 'flex',
  borderRadius: '30px',
  minHeight: '1.5rem',
  minWidth: '1.5rem',
  justifyContent: 'center',
  alignItems: 'center'
})
