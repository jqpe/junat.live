declare module '*.svg' {
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
