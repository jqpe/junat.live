import type { ComponentProps } from 'react'

import { StyledForm } from './styles'

export type FormProps = ComponentProps<typeof StyledForm>

/**
 * @requires {@link https://formik.org/docs/api/formik \<Formik/>}
 */
export function Form(props: FormProps) {
  return <StyledForm {...props} />
}
