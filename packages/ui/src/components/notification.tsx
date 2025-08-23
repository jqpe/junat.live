import { cx } from 'cva'
import { motion } from 'motion/react'

type Props = {
  title: string
  body: string
}

export const Notification = (props: Props) => {
  return (
    <motion.aside
      role="alert"
      aria-live="polite"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cx(
        'relative mb-2 mt-4 flex flex-col gap-1 rounded-[3px] bg-secondaryA-400',
        'p-[5px] text-secondary-700 shadow-[0px_0px_2px_1px_theme(colors.secondaryA.500)]',
        'dark:text-secondary-400',
      )}
    >
      <h6 className="leading-5">{props.title}</h6>
      <p className="text-sm leading-4"> {props.body}</p>
    </motion.aside>
  )
}
