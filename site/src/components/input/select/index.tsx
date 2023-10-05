import * as Primitive from '@radix-ui/react-select'
import React from 'react'

import Check from '~/components/icons/check.svg'

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
      <Primitive.Trigger
        aria-label={props.label}
        className="bg-gray-800 text-gray-200 cursor-pointer select-none p-[5px_15px] flex gap-[10px] border-[5px]"
      >
        <Primitive.Icon style={{ display: 'flex', alignItems: 'center' }}>
          {props.Icon}
        </Primitive.Icon>
        <Primitive.Value placeholder={props.placeholder} />
      </Primitive.Trigger>

      <Primitive.Portal>
        <Primitive.Content className="overflow-hidden text-gray-800 bg-gray-100 dark:text-gray-200 dark:bg-gray-900 p-[5px_15px] rounded-[3px] shadow-lg">
          <Primitive.ScrollUpButton />

          <Primitive.Viewport className="flex flex-col">
            {Object.keys(props.items).map(key => (
              <Primitive.Item
                value={key}
                key={key}
                className="flex items-center select-none p-[0px_10px] rounded-full transition-colors [animation-timing-function:sine-in] duration-200 data-[highlighted]:bg-grayA-400  data-[highlighted]:dark:bg-grayA-300"
              >
                <Primitive.ItemText>{props.items[key]}</Primitive.ItemText>
                <Primitive.ItemIndicator className="flex">
                  <Check className="fill-gray-900 dark:fill-gray-100" />
                </Primitive.ItemIndicator>
              </Primitive.Item>
            ))}
          </Primitive.Viewport>

          <Primitive.ScrollDownButton />
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  )
}
