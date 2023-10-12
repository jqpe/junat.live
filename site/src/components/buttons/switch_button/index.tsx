import React, { ReactNode } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { Root, Thumb } from '@radix-ui/react-switch'

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
}

export const SwitchButton = (props: Props) => {
  const [checked, setChecked] = React.useState(false)

  React.useMemo(() => {
    if (props.checked !== undefined) {
      setChecked(props.checked)
    }
  }, [props.checked])

  return (
    <form>
      <div className="flex items-center">
        <Root
          data-disabled={props.disabled}
          className="w-[43px] h-[24px] focus:outline-offset-0 bg-gray-300 rounded-full relative shadow-[0_2px_5px] shadow-gray-500 [-webkit-tap-highlight-color:transparent] data-[disabled=true]:opacity-50
          dark:bg-transparent dark:shadow-none dark:border-2 dark:border-gray-800 dark:w-[52px] dark:h-[28px] dark:pl-[3px]"
          disabled={props.disabled}
          id={props.id}
          checked={props.checked}
          onCheckedChange={checked => {
            setChecked(checked)
            props.onCheckedChange?.(checked)
          }}
        >
          <Thumb
            className='flex w-[24px] h-[24px] bg-white rounded-full transition-[transform] duration-150 ease-in-out will-change-transform data-[state="checked"]:[transform:translateX(19px)]
          dark:bg-transparent'
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
