import type { FieldAttributes } from 'formik'

import { Field as FormikField } from 'formik'

export type FieldProps<T = unknown> = FieldAttributes<T>

/**
 * @requires {@link https://formik.org/docs/api/formik \<Formik/> }
 */
export function Field(props: FieldProps) {
  return (
    // TODO: refactor after enabling preflight https://tailwindcss.com/docs/border-width#using-without-preflight
    <FormikField
      className={`border-x-0 border-b-[1px] border-t-0 border-solid border-b-gray-200 text-gray-800 dark:border-b-gray-800 dark:text-gray-200 [&::-webkit-input-placeholder]:text-gray-500 [&[type="date"]]:flex [&[type="date"]]:items-center`}
      {...props}
    />
  )
}
