import type { ReactNode } from 'react'

import { Root, Thumb } from '@radix-ui/react-switch'
import { cx } from 'cva'
import { AnimatePresence, motion } from 'motion/react'
import React from 'react'

type Props = {
  /**
   * Unique id for the switch
   */
  id: string
  /**
   * First node is the element that is rendered when switch is not checked. The children should be at most 24*24.
   */
  children: [ReactNode, ReactNode]
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  checked?: boolean
  ['aria-label']: string
  [dataAttr: `data-${string}`]: string
}

export const ToggleButton = (props: Props) => {
  const [checked, setChecked] = React.useState(false)
  const dataAttributes = React.useMemo(() => {
    return Object.fromEntries(
      Object.keys(props)
        .filter(key => key.startsWith('data-'))
        .map(key => [key, props[key as `data-${string}`]]),
    )
  }, [props])

  React.useMemo(() => {
    if (props.checked !== undefined) {
      setChecked(props.checked)
    }
  }, [props.checked])

  return (
    <form>
      <div className="flex items-center">
        <Root
          {...dataAttributes}
          aria-label={props['aria-label']}
          data-disabled={props.disabled}
          className={cx(
            'relative h-[24px] rounded-full bg-gray-300 shadow-[0_2px_5px] shadow-gray-500',
            '[-webkit-tap-highlight-color:transparent] focus-visible:outline-offset-0',
            'data-[disabled=true]:opacity-50 dark:h-[28px] dark:w-[52px] dark:border-2',
            'w-[43px] dark:border-gray-800 dark:bg-transparent dark:pl-[3px] dark:shadow-none',
          )}
          disabled={props.disabled}
          id={props.id}
          checked={props.checked}
          onCheckedChange={checked => {
            setChecked(checked)
            props.onCheckedChange?.(checked)
          }}
        >
          <Thumb
            className={cx(
              'flex h-[24px] w-[24px] rounded-full bg-white duration-150',
              'transition-[transform] ease-in-out will-change-transform',
              'data-[state="checked"]:[transform:translateX(19px)] dark:bg-transparent',
            )}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {checked ? (
                <motion.div
                  key="2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 0.8 }}
                  exit={{ scale: 0 }}
                >
                  {props.children[1]}
                </motion.div>
              ) : (
                <motion.div
                  key="1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 0.8 }}
                  exit={{ scale: 0 }}
                >
                  {props.children[0]}
                </motion.div>
              )}
            </AnimatePresence>
          </Thumb>
        </Root>
      </div>
    </form>
  )
}
