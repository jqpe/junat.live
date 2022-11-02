import * as Primitive from '@radix-ui/react-select'
import React from 'react'

import {
  StyledTrigger,
  StyledContent,
  StyledViewport,
  StyledItemIndicator,
  StyledCheck,
  StyledItem
} from './styles'

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
  /**
   * Accessible description of the select button
   */
  label: string
}

export function Select(props: SelectProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Primitive.Root {...props} open={open} onOpenChange={setOpen}>
      <StyledTrigger aria-label={props.label}>
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
