import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const path = decodeURI(request.nextUrl.pathname)
    .split('/')
    .filter(path => Boolean(path))

  const trainPaths = ['tåg', 'train', 'juna']

  if (trainPaths.includes(path[0])) {
    console.log(decodeURI(request.nextUrl.href).replace(path[0], 'train'))

    return NextResponse.rewrite(
      decodeURI(request.nextUrl.href).replace(path[0], 'train')
    )
  }
}
