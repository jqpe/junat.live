import { NextApiRequest, NextApiResponse } from 'next'

import initialWebmanifest from './site.webmanifest'

const getLocale = (languageHeader?: string): 'fi' | 'en' | 'sv' => {
  if (!languageHeader) {
    return 'fi'
  }

  if (/^en(-\w)*/.test(languageHeader)) {
    return 'en'
  }

  if (/^sv/.test(languageHeader)) {
    return 'sv'
  }

  return 'fi'
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (!request.url) {
    response.status(420).end()
    return
  }

  const url = new URL(request.url, `http://${request.headers.host}`)

  const params = url.searchParams
  const webmanifest = { ...initialWebmanifest }

  if (params.has('startUrl')) {
    webmanifest.start_url = `/${getLocale(
      request.headers['accept-language']
    )}${params.get('startUrl')}`
  }

  if (params.has('name')) {
    webmanifest.name = params.get('name')
  }

  if (params.has('shortName')) {
    webmanifest.short_name = params.get('shortName')
  }

  if (params.has('id')) {
    webmanifest.id = params.get('id')
  }

  response.setHeader('Content-Type', 'application/manifest+json; charset=utf-8')
  response.setHeader('Cache-Control', 'public, max-age=31536000, immutable')

  response.status(200).send(webmanifest)
}
