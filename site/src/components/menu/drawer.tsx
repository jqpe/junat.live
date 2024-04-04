import { RemoveScroll } from 'react-remove-scroll'
import { motion } from 'framer-motion'
import { MenuItem } from './item'

export const MenuDrawer = ({ isMenuOpen }: { isMenuOpen: boolean }) => {
  return (
    <RemoveScroll enabled={isMenuOpen}>
      <motion.div
        aria-hidden={!isMenuOpen}
        initial={{ opacity: 0 }}
        animate={isMenuOpen ? { opacity: 1 } : { opacity: 0 }}
        style={{
          pointerEvents: isMenuOpen ? 'all' : 'none',
          visibility: isMenuOpen ? 'visible' : 'hidden'
        }}
        className="fixed inset-0 h-full top-[42px] dark:bg-gray-900 dark:bg-opacity-30
     bg-gray-800 bg-opacity-5 backdrop-blur-lg backdrop-brightness-110 dark:backdrop-brightness-75 z-40 select-none"
      >
        <div className="px-[1.875rem] max-w-[500px] m-auto py-9 flex flex-col gap-10">
          <MenuItem href="/contact">Contact</MenuItem>
          <MenuItem href="/settings">Settings</MenuItem>
        </div>
      </motion.div>
    </RemoveScroll>
  )
}
