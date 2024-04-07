import type { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  toggle: ReactNode
  label: ReactNode
}

export const SettingsToggleItem = (props: Props) => {
  return (
    <div className="flex gap-2 items-center">
      {props.icon}
      <div className="flex justify-between items-center flex-wrap flex-1 gap-1">
        {props.label}
        {props.toggle}
      </div>
    </div>
  )
}
