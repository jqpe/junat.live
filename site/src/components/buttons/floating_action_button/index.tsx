import type { ReactNode } from 'react'

export function FloatingActionButton(props: {
  children: ReactNode | ReactNode[]
}) {
  return (
    <button
      className="fixed bottom-[1rem] right-[1rem] rounded-full bg-primary-700 shadow-[2px_2px_30px_rgba(0,0,0,0.15)] flex p-[0.75rem] lg:right-[calc(50%-300px)] cursor-pointer"
      type="button"
    >
      {props.children}
    </button>
  )
}
