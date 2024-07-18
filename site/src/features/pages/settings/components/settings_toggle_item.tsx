import type { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  toggle: ReactNode
  label: ReactNode
}

export const SettingsToggleItem = (props: Props) => {
  return (
    <div className="flex flex-col gap-2 rounded-md bg-gray-200 bg-opacity-50 px-2 py-2 dark:bg-gray-800 dark:bg-opacity-40">
      <div className="flex items-center gap-1 after:border-b-[1px]">
        {props.icon}
        {props.label}
      </div>

      <div>{props.toggle}</div>
    </div>
  )
}
