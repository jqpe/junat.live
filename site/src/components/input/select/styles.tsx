import { styled } from '@junat/design'
import * as Primitive from '@radix-ui/react-select'

import { Check } from './check_icon'

export const StyledContent = styled(Primitive.Content, {
  overflow: 'hidden',
  color: '$slateGray800',
  backgroundColor: '$slateGray100',
  '@dark': {
    color: '$slateGray200',
    backgroundColor: '$slateGray900'
  },
  padding: '$xxs $s',
  borderRadius: 3,
  boxShadow:
    '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',

  transition: 'transform 1s ease-in',
  '&[data-state="open"]': {
    transform: 'scale(1)'
  },
  '&[data-state="closed"]': {
    transform: 'scale(0)'
  }
})

export const StyledItem = styled(Primitive.Item, {
  display: 'flex',
  alignItems: 'center',
  userSelect: 'none',
  padding: '0px 10px',
  borderRadius: '9999px',
  transition: 'background-color 0.2s sine-in',
  '&[data-highlighted]': {
    background: '$slateGrayA400',
    '@dark': {
      backgroundColor: '$slateGrayA300'
    }
  }
})
export const StyledCheck = styled(Check, {
  fill: '$slateGray900',
  '@dark': {
    fill: '$slateGray100'
  }
})

export const StyledItemIndicator = styled(Primitive.ItemIndicator, {
  display: 'flex'
})

export const StyledTrigger = styled(Primitive.Trigger, {
  backgroundColor: '$slateGray800',
  color: '$slateGray200',
  cursor: 'pointer',
  userSelect: 'none',
  padding: '$xxs $s',
  display: 'flex',
  gap: '10px',
  border: '5px'
})

export const StyledViewport = styled(Primitive.Viewport, {
  display: 'flex',
  flexDirection: 'column'
})
