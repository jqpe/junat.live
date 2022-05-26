const DIGITRAFFIC_API_URL = 'https://rata.digitraffic.fi/api/v1'

export const getUrl = (path: string, query?: URLSearchParams) => {
  return `${DIGITRAFFIC_API_URL}${path}` + (query ? `?${query}` : '')
}
