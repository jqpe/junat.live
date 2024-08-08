import { NextRequest } from 'next/server'
import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'edge',
}

export default async function OpenGraph(request: NextRequest) {
  try {
    const font = fetch(
      new URL('/fonts/Mona-Sans-RegularWide.ttf', request.url),
    ).then(res => res.arrayBuffer())

    const { searchParams } = new URL(request.url)
    const monaSans = await font

    if (!searchParams.has('title')) {
      throw new TypeError(`Required search query parameter 'title' is missing`)
    }

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: '#7100c2',
            backgroundImage:
              'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            backgroundPosition: '-30px -10px',
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              justifyItems: 'center',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Junat.live"
              height={200}
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='116' height='100' viewBox='0 0 24 24' style='fill: white;transform: ;msFilter:;'%3E%3Ccircle cx='8.5' cy='14.5' r='1.5'%3E%3C/circle%3E%3Ccircle cx='15.5' cy='14.5' r='1.5'%3E%3C/circle%3E%3Cpath d='M18.87 3.34A3.55 3.55 0 0 0 16.38 2H7.62a3.47 3.47 0 0 0-2.5 1.35A4.32 4.32 0 0 0 4 6v12a1 1 0 0 0 1 1h2l-2 3h2.32L8 21h8l.68 1H19l-2-3h2a1 1 0 0 0 1-1V6a4.15 4.15 0 0 0-1.13-2.66zM7.62 4h8.72a1.77 1.77 0 0 1 1 .66 3.25 3.25 0 0 1 .25.34H6.39a2.3 2.3 0 0 1 .25-.35A1.65 1.65 0 0 1 7.62 4zM6 8V7h12v3H6zm12 9H6v-5h12z'%3E%3C/path%3E%3C/svg%3E"
              style={{ margin: '0 30px' }}
              width={232}
            />
          </div>
          <div
            style={{
              fontSize: 48,
              maxWidth: '600px',
              overflowWrap: 'break-word',
              fontStyle: 'normal',
              fontFamily: 'MonaSans',
              color: 'white',
              marginTop: 30,
              padding: '0 120px',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
            }}
          >
            {searchParams.get('title')}
          </div>
        </div>
      ),
      {
        fonts: [
          {
            name: 'MonaSans',
            data: monaSans,
            style: 'normal',
          },
        ],
      },
    )
  } catch (error: unknown) {
    console.error(error)

    return new Response('Failed to serve image', {
      status: 500,
    })
  }
}
