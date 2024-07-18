import React from 'react'

export function FloatingActionButton<T extends React.ElementType = 'button'>(
  props: { as?: T } & React.ComponentPropsWithRef<T>,
) {
  const As = props.as ?? 'button'

  return (
    <As
      className="fixed bottom-[1rem] right-[1rem] flex cursor-pointer rounded-full bg-primary-700 p-[0.75rem] shadow-[2px_2px_30px_rgba(0,0,0,0.15)] lg:right-[calc(50%-300px)]"
      type="button"
      {...props}
    />
  )
}
