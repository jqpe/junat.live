import { keyframes, styled } from '@junat/design'
import { Root as ToastRoot } from '@radix-ui/react-toast'

const slideLeft = keyframes({
  from: { transform: 'translateX(-var(--radix-toast-swipe-end-x))' },
  to: { transform: 'translateX(-100%)', opacity: 0 }
})

export const Root = styled(ToastRoot, {
  pointerEvents: 'all',
  padding: '0.35rem 0.725rem',
  borderRadius: '3px',
  backgroundColor: '$slateGrayA800',
  color: '$slateGray200',
  backdropFilter: 'blur(3px)',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '500px',
  lineHeight: '130%',
  display: 'flex',
  '@dark': {
    backgroundColor: '$slateGrayA800',
    border: '1px solid $slateGray800'
  },
  '@media (prefers-reduced-motion: no-preference)': {
    '&[data-swipe="move"]': {
      transform: 'translateX(var(--radix-toast-swipe-move-x))'
    },
    '&[data-state="closed"]': {
      animation: `${slideLeft} 100ms ease-in forwards`
    },
    '&[data-swipe="cancel"]': {
      transform: 'translateX(0)',
      transition: 'transform 200ms ease-out'
    },
    '&[data-swipe="end"]': {
      animation: `${slideLeft} 500ms cubic-bezier(.02,1.23,1,.99) forwards`
    }
  }
})
