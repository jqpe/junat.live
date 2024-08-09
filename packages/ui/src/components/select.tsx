import React from 'react'
import * as Primitive from '@radix-ui/react-select'
import { cx } from 'cva'

import Check from '../icons/check.svg'

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
  /** Accessible description of the select button */
  label: string
}

export function Select(props: SelectProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Primitive.Root {...props} open={open} onOpenChange={setOpen}>
      <Primitive.Trigger
        aria-label={props.label}
        className={cx(
          'flex cursor-pointer select-none gap-[10px]',
          'bg-gray-800 p-[5px_15px] text-gray-200',
        )}
      >
        <Primitive.Icon style={{ display: 'flex', alignItems: 'center' }}>
          {props.Icon}
        </Primitive.Icon>
        <Primitive.Value placeholder={props.placeholder} />
      </Primitive.Trigger>

      <Primitive.Portal>
        <Primitive.Content
          className={cx(
            'overflow-hidden rounded-[3px] bg-gray-100 p-[5px_15px]',
            'text-gray-800 shadow-lg dark:bg-gray-900 dark:text-gray-200',
          )}
        >
          <Primitive.ScrollUpButton />

          <Primitive.Viewport className="flex flex-col">
            {Object.keys(props.items).map(key => (
              <Primitive.Item
                value={key}
                key={key}
                className={cx(
                  'flex select-none items-center rounded-full p-[0px_10px] transition-colors',
                  'data-[highlighted]:bg-grayA-400 data-[highlighted]:dark:bg-grayA-300',
                  'duration-200 [animation-timing-function:sine-in]',
                )}
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
