import Image from 'next/image'

import { Button } from '~/components/button'
import trees from '../assets/trees.jpg'

export function NotFound() {
  return (
    <div className="relative flex h-[100vh] w-[100vw] flex-col items-center justify-center gap-5">
      <Image
        className="-z-10 opacity-50 dark:opacity-20"
        placeholder="blur"
        fill
        src={trees}
        alt=""
      />

      <div className="flex max-w-[90vw] items-center gap-6">
        <h1>404</h1>
        <span role="presentation">|</span>
        <p>The page you were looking for could not be found.</p>
      </div>

      <Button
        as="a"
        href="/"
        className="[text-decoration:none] hover:text-gray-200 focus-visible:text-gray-200"
      >
        Back to junat.live
      </Button>
    </div>
  )
}
