import { ReactChild, MouseEventHandler, useState } from 'react'

import location from '../../../public/icons/location.svg'

import Image from 'next/image'

interface GeolocationButtonProps {
  alt: string
  handleClick: MouseEventHandler<HTMLButtonElement>
}

export default function GeolocationButton({
  handleClick,
  alt
}: GeolocationButtonProps) {
  return (
    <button onClick={handleClick}>
      <Image src={location} alt={alt} />
    </button>
  )
}
