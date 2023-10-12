import { PrimaryButton } from '~/components/buttons/primary'

import trees from '../assets/trees.jpg'

import Image from 'next/image'

export function NotFound() {
  return (
    <div className="h-[100vh] w-[100vw] relative flex flex-col justify-center items-center gap-5">
      <Image
        className="opacity-50 dark:opacity-20 -z-10"
        placeholder="blur"
        fill
        src={trees}
        alt=""
      />

      <div className="flex items-center gap-6 max-w-[90vw]">
        <h1>404</h1>
        <span role="presentation">|</span>
        <p>The page you were looking for could not be found.</p>
      </div>

      <PrimaryButton
        as="a"
        href="/"
        className="[text-decoration:none] hover:text-gray-200 focus:text-gray-200"
      >
        Back to junat.live
      </PrimaryButton>
    </div>
  )
}
