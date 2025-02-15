// from https://github.com/reach/reach-ui/blob/43f450db7bcb25a743121fe31355f2294065a049/packages/polymorphic/src/reach-polymorphic.ts
// License MIT (https://github.com/reach/reach-ui/blob/43f450db7bcb25a743121fe31355f2294065a049/LICENSE)
//
// Enables polymorphic components like <Button as="a"/>. It's not a duck 🦆, but it looks like a duck.

/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type * as React from 'react'
import type { JSX } from 'react'

type Merge<P1 = {}, P2 = {}> = Omit<P1, keyof P2> & P2

/**
 * Infers the OwnProps if E is a ForwardRefExoticComponentWithAs
 */
type OwnProps<E> = E extends ForwardRefComponent<any, infer P> ? P : {}

/**
 * Infers the JSX.IntrinsicElement if E is a ForwardRefExoticComponentWithAs
 */
type IntrinsicElement<E> =
  E extends ForwardRefComponent<infer I, any> ? I : never

type ForwardRefExoticComponent<E, OwnProps> = React.ForwardRefExoticComponent<
  Merge<
    E extends React.ElementType ? React.ComponentPropsWithRef<E> : never,
    OwnProps & { as?: E }
  >
>

interface ForwardRefComponent<
  IntrinsicElementString,
  OwnProps = {},
  /*
   * Extends original type to ensure built in React types play nice with
   * polymorphic components still e.g. `React.ElementRef` etc.
   */
> extends ForwardRefExoticComponent<IntrinsicElementString, OwnProps> {
  /*
   * When `as` prop is passed, use this overload. Merges original own props
   * (without DOM props) and the inferred props from `as` element with the own
   * props taking precendence.
   *
   * We explicitly avoid `React.ElementType` and manually narrow the prop types
   * so that events are typed when using JSX.IntrinsicElements.
   */
  <As = IntrinsicElementString>(
    props: As extends ''
      ? { as: keyof JSX.IntrinsicElements }
      : As extends React.ComponentType<infer P>
        ? Merge<P, OwnProps & { as: As }>
        : As extends keyof JSX.IntrinsicElements
          ? Merge<JSX.IntrinsicElements[As], OwnProps & { as: As }>
          : never,
  ): React.ReactElement | null
}

interface MemoComponent<IntrinsicElementString, OwnProps = {}>
  extends React.MemoExoticComponent<
    ForwardRefComponent<IntrinsicElementString, OwnProps>
  > {
  <As = IntrinsicElementString>(
    props: As extends ''
      ? { as: keyof JSX.IntrinsicElements }
      : As extends React.ComponentType<infer P>
        ? Merge<P, OwnProps & { as: As }>
        : As extends keyof JSX.IntrinsicElements
          ? Merge<JSX.IntrinsicElements[As], OwnProps & { as: As }>
          : never,
  ): React.ReactElement | null
}

export type {
  ForwardRefComponent,
  IntrinsicElement,
  MemoComponent,
  Merge,
  OwnProps,
}
