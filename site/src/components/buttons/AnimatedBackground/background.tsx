export function Background({ style }: { style: 'dark' | 'light' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 700 700"
      width="700"
      height="700"
    >
      <defs>
        <linearGradient
          gradientTransform="rotate(234, 0.5, 0.5)"
          x1="50%"
          y1="0%"
          x2="50%"
          y2="100%"
          id="gradient"
        >
          <stop
            stopColor={style === 'light' ? '#f6eaff' : '#420071'}
            stopOpacity="1"
            offset="0%"
          ></stop>
          <stop
            stopColor={style === 'light' ? '#fbfbfb' : '#030304'}
            stopOpacity="1"
            offset="100%"
          ></stop>
        </linearGradient>
        <filter
          id="filter"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.005 0.006"
            numOctaves="2"
            seed="86"
            stitchTiles="stitch"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            result="turbulence"
          ></feTurbulence>
          <feGaussianBlur
            stdDeviation="31 9"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="turbulence"
            edgeMode="duplicate"
            result="blur"
          ></feGaussianBlur>
          <feBlend
            mode="hard-light"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="SourceGraphic"
            in2="blur"
            result="blend"
          ></feBlend>
        </filter>
      </defs>
      <rect
        width="700"
        height="700"
        fill="url(#gradient)"
        filter="url(#filter)"
      ></rect>
    </svg>
  )
}
