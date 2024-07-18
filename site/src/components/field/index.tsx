import type { FieldAttributes } from 'formik'

import { Field as FormikField } from 'formik'

export type FieldProps<T = unknown> = FieldAttributes<T>

/**
 * @requires {@link https://formik.org/docs/api/formik \<Formik/> }
 */
export function Field(props: FieldProps) {
  return (
    <FormikField
      className={`border-b-[1px] border-b-gray-200 text-gray-800 dark:border-b-gray-800 dark:text-gray-200
      [&::-webkit-input-placeholder]:text-gray-500 [&[type="date"]]:flex [&[type="date"]]:items-center`}
      {...props}
    />
  )
}
