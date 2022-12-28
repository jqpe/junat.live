import { keyframes, styled } from '@junat/design'

import * as Dialog from '@radix-ui/react-dialog'

export const StyledTitle = styled(Dialog.Title, {
  color: '$slateGray900',
  fontSize: '$mobile-h4',
  '@large': {
    fontSize: '$pc-h4'
  },
  '@dark': {
    color: '$slateGray100'
  }
})

export const StyledDescription = styled(Dialog.Description, {
  margin: '10px 0 20px',
  color: '$slateGray700',
  '@dark': {
    color: '$slateGray500'
  }
})

export const StyledClose = styled(Dialog.Close, {
  borderRadius: '9999px',
  display: 'flex',
  padding: '$xss',
  position: 'absolute',
  right: '10px',
  top: '10px',
  '& svg': {
    fill: '$slateGray600'
  }
})

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 }
})

export const StyledOverlay = styled(Dialog.Overlay, {
  backdropFilter: 'blur(3px)',
  position: 'fixed',
  inset: 0,
  backgroundColor: 'hsla(0,0%,100%, 0.87)',
  display: 'grid',
  placeItems: 'center',
  animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  '@dark': {
    backgroundColor: 'hsla(0,0%,0%, 0.87)'
  }
})

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }
})

export const StyledContent = styled(Dialog.Content, {
  backgroundColor: '$slateGray100',
  borderRadius: '12px',
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  padding: '25px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  overflow: 'clip',
  width: '90vw',
  maxWidth: '450px',
  maxHeight: '85vh',
  overflowY: 'auto',
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  '@dark': {
    backgroundColor: '$slateGray800'
  },
  '& [data-children]': {
    overflow: 'auto'
  }
})
