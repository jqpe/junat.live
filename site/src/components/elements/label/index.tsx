import React from 'react'

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className="text-gray-700 text-[0.74rem] lg:text-[0.83rem] dark:text-gray-300"
      {...props}
    />
  )
}
