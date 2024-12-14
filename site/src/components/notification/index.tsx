import { cx } from 'cva'
import { motion } from 'motion/react'

type Props = {
  title: string
  body: string
}

export const Notification = (props: Props) => {
  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cx(
        'relative my-5 flex flex-col gap-[15px] rounded-[3px] bg-secondaryA-400',
        'p-[5px] shadow-[0px_0px_2px_1px_theme(colors.secondaryA.500)]',
      )}
    >
      <h4>{props.title}</h4>
      <p> {props.body}</p>
    </motion.aside>
  )
}
