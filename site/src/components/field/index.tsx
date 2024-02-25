import type { FieldAttributes } from 'formik'

import { Field as FormikField } from 'formik'
import { VariantProps, cva } from 'cva'

export type FieldProps<T = unknown> = FieldAttributes<T>

const field = cva({
  base: `border-solid border-b-[1px] border-x-0 border-t-0 border-b-gray-200 text-gray-800 dark:border-b-gray-700 dark:text-gray-200
  [&::-webkit-input-placeholder]:text-gray-500 `,
  variants: {
    component: {
      textarea: 'w-full resize-y min-h-fit'
    },
    type: {
      checkbox:
        'bg-gray-700 p-1 border-none [&[value="true"]]:bg-primary-500 rounded-sm mr-1',
      date: 'flex items-center'
    }
  }
})

/**
 * @requires {@link https://formik.org/docs/api/formik \<Formik/> }
 */
export function Field(props: FieldProps) {
  let component: VariantProps<typeof field>['component']

  if (typeof props.component === 'string' && props.component === 'textarea') {
    component = props.component
  }

  return (
    <FormikField
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      className={field({ component, type: props.type as any })}
      {...props}
    />
  )
}
