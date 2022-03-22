import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const path = decodeURI(request.nextUrl.pathname)
    .split('/')
    .filter(path => Boolean(path))

  const trainPaths = ['tåg', 'train', 'juna']

  if (trainPaths.includes(path[0])) {
    return NextResponse.rewrite(
      decodeURI(request.nextUrl.href).replace(path[0], 'train')
    )
  }
}
