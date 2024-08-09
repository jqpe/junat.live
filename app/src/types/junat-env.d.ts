/* eslint-disable unicorn/filename-case */
declare module '*.svg' {
  import { FC, SVGProps } from 'react'
  const content: FC<SVGProps<SVGElement>>
  export default content
}

interface Window {
  __theme: 'light' | 'dark'
  __setPreferredTheme: (theme?: 'light' | 'dark') => void
}
