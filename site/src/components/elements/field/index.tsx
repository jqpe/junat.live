import type { FieldAttributes } from 'formik'

import { StyledField } from './styles'

export type FieldProps<T = unknown> = FieldAttributes<T>

/**
 * @requires {@link https://formik.org/docs/api/formik \<Formik/> }
 */
export function Field(props: FieldProps) {
  return <StyledField {...props} />
}
