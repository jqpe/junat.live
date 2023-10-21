import { motion } from 'framer-motion'

type Props = {
  title: string
  body: string
}

export const Notification = (props: Props) => {
  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="my-5 bg-secondaryA-400 rounded-[3px] p-[5px] relative shadow-[0px_0px_2px_1px_theme(colors.secondaryA.500)] flex flex-col gap-[15px]"
    >
      <h4>{props.title}</h4>
      <p> {props.body}</p>
    </motion.aside>
  )
}
