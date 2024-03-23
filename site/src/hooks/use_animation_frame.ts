import React from 'react'

export const useAnimationFrame = (
  nextAnimationFrameHandler: () => unknown,
  shouldAnimate = true
) => {
  const frame = React.useRef(0)

  const animate = () => {
    nextAnimationFrameHandler()
    frame.current = requestAnimationFrame(animate)
  }

  React.useEffect(() => {
    if (shouldAnimate) {
      frame.current = requestAnimationFrame(animate)
    } else {
      cancelAnimationFrame(frame.current)
    }

    return () => cancelAnimationFrame(frame.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAnimate])
}
