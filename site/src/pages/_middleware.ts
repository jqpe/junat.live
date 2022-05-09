import { NextRequest, NextResponse } from 'next/server'

import initialWebmanifest from '../../public/webmanifest.json'

export async function middleware(request: NextRequest) {
  if (/manifest\.json\?/.test(request.url)) {
    const params = request.nextUrl.searchParams
    const webmanifest = { ...initialWebmanifest }

    if (params.has('startUrl')) {
      webmanifest.start_url = `${request.nextUrl.origin}${params.get(
        'startUrl'
      )}`
    }

    if (params.has('name')) {
      webmanifest.name = params.get('name')!
    }

    if (params.has('shortName')) {
      webmanifest.short_name = params.get('shortName')!
    }

    if (params.has('id')) {
      // @ts-ignore
      webmanifest.id = params.get('id')!
    }

    return NextResponse.json(webmanifest, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    })
  }

  const path = decodeURI(request.nextUrl.pathname)
    .split('/')
    .filter(path => Boolean(path))

  const trainPaths = ['tåg', 'train', 'juna']

  if (trainPaths.includes(path[0])) {
    // If the path is in form /train/trainNumber replace trainNumber with 'latest' and shift trainNumber to be after that.
    // Becomes: train/latest/trainNumber; used to provide a shortcut for users to install a specific train in their homescreen.
    if (path.length === 2) {
      path[2] = path[1]
      path[1] = 'latest'

      request.nextUrl.href = request.nextUrl.href.replace(
        /\/\d+/,
        `/${path[1]}/${path[2]}`
      )
    }

    return NextResponse.rewrite(
      decodeURI(request.nextUrl.href).replace(path[0], 'train')
    )
  }
}
