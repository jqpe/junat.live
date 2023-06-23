import { Field } from 'formik'

import { styled } from '@junat/design'

export const StyledField = styled(Field, {
  borderBottom: '1px solid $slateGray200',
  color: '$slateGray800',

  ':root.dark &': {
    borderBottom: '1px solid $slateGray800',
    color: '$slateGray200'
  },

  '&::-webkit-input-placeholder': {
    color: '$slateGray500'
  },

  '&[type="date"]': {
    display: 'flex',
    alignItems: 'center',
    ':root.dark &': {
      colorScheme: 'dark'
    }
  }
})
