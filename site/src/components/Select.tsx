import { styled } from '@junat/design'
import * as Primitive from '@radix-ui/react-select'
import React from 'react'

export interface SelectProps extends Primitive.SelectProps {
  /**
   * An object with the selectable items
   *
   * `value` is passed to `onValueChange`
   */
  items: {
    [value: string]: string
  }
  Icon?: JSX.Element
  placeholder?: string
}

const StyledContent = styled(Primitive.Content, {
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

const StyledItem = styled(Primitive.Item, {
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

const Check = (props: Record<string, unknown>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24">
    <path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z" />
  </svg>
)

const StyledCheck = styled(Check, {
  fill: '$slateGray900',
  '@dark': {
    fill: '$slateGray100'
  }
})

const StyledItemIndicator = styled(Primitive.ItemIndicator, {
  display: 'flex'
})

const StyledTrigger = styled(Primitive.Trigger, {
  backgroundColor: '$slateGray800',
  color: '$slateGray200',
  cursor: 'pointer',
  userSelect: 'none',
  padding: '$xxs $s',
  display: 'flex',
  gap: '10px',
  border: '5px'
})

const StyledViewport = styled(Primitive.Viewport, {
  display: 'flex',
  flexDirection: 'column'
})

export function Select(props: SelectProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Primitive.Root {...props} open={open} onOpenChange={setOpen}>
      <StyledTrigger>
        <Primitive.Icon style={{ display: 'flex', alignItems: 'center' }}>
          {props.Icon}
        </Primitive.Icon>
        <Primitive.Value placeholder={props.placeholder} />
      </StyledTrigger>

      <Primitive.Portal>
        <StyledContent>
          <Primitive.ScrollUpButton />

          <StyledViewport>
            {Object.keys(props.items).map(key => (
              <StyledItem value={key} key={key}>
                <Primitive.ItemText>{props.items[key]}</Primitive.ItemText>
                <StyledItemIndicator>
                  <StyledCheck />
                </StyledItemIndicator>
              </StyledItem>
            ))}
          </StyledViewport>

          <Primitive.ScrollDownButton />
        </StyledContent>
      </Primitive.Portal>
    </Primitive.Root>
  )
}
