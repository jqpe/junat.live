declare module '*.svg' {
  import { FC, SVGProps } from 'react'
  const content: FC<SVGProps<SVGElement>>
  export default content
}

declare module '*.svg?react' {
  import * as React from 'react'

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const ReactComponent: React.FunctionComponent<
    React.ComponentProps<'svg'> & {
      title?: string
      titleId?: string
      desc?: string
      descId?: string
    }
  >

  export default Awaited<ReactComponent>
}
