/* eslint-disable sonarjs/no-duplicate-string */
import { motion } from 'framer-motion'
import { styled } from '@junat/design'

export const StyledTimetableRow = styled(motion.tr, {
  display: 'grid',
  gridTemplateColumns: 'min(35%, 30vw) 1fr 0.4fr 0.4fr',
  gap: '0.5vw',
  paddingBlock: '$xs',
  position: 'relative',
  fontSize: '$mobile-paragraph',
  '@large': {
    fontSize: '$pc-paragraph'
  },
  '@media (max-width: 20rem)': {
    fontSize: 'calc(.5rem + 1vw)'
  },

  '& a': {
    color: '$slateGray800',
    cursor: 'pointer',
    ':root.dark &': {
      color: '$slateGray200'
    },
    '&:hover, &:focus': {
      color: '$primary600'
    }
  },

  '&:nth-child(1)': {
    paddingBlockStart: '$xxs'
  },

  '&:not(:nth-child(1))::after': {
    position: 'absolute',
    content: ' ',
    borderBottom: '1px solid $slateGray200',
    ':root.dark &': {
      borderColor: '$slateGray800'
    },
    height: '1px',
    width: '100%'
  },
  '&[data-cancelled="true"]': {
    opacity: 0.5,
    fontSize: '0.8rem'
  }
})

export const StyledTimetableRowData = styled('td', {
  display: 'flex',
  overflow: 'hidden',
  whiteSpace: 'pre-line',
  color: '$slateGray800',
  ':root.dark &': {
    color: '$slateGray200'
  },

  '&:nth-child(2)': {
    fontFeatureSettings: 'tnum',
    display: 'flex',
    gap: '5px'
  },

  '&:nth-child(2) > :nth-child(2)': {
    color: '$primary700',
    ':root.dark &': {
      color: '$primary400'
    }
  }
})

export const StyledTime = styled('time', {
  fontVariantNumeric: 'tabular-nums'
})

export const CenteredTd = styled(StyledTimetableRowData, {
  display: 'flex',
  justifyContent: 'center'
})
