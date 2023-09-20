import React, { ReactNode } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import { Flex, SwitchRoot, SwitchThumb } from './styles'

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
      <Flex>
        <SwitchRoot
          disabled={props.disabled}
          id={props.id}
          checked={props.checked}
          onCheckedChange={checked => {
            setChecked(checked)
            props.onCheckedChange?.(checked)
          }}
        >
          <SwitchThumb>
            <AnimatePresence mode="popLayout" initial={false}>
              {checked ? (
                <motion.div
                  key="2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  {props.children[1]}
                </motion.div>
              ) : (
                <motion.div
                  key="1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  {props.children[0]}
                </motion.div>
              )}
            </AnimatePresence>
          </SwitchThumb>
        </SwitchRoot>
      </Flex>
    </form>
  )
}
