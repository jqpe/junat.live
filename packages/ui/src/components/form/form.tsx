import type { ComponentProps } from 'react'

import { Form as FormikForm } from 'formik'

export type FormProps = ComponentProps<typeof FormikForm>

/**
 * @requires {@link https://formik.org/docs/api/formik \<Formik/>}
 */
export function Form(props: FormProps) {
  return <FormikForm {...props} />
}
