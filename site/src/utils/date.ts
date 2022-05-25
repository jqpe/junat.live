const prefix = (n: string) => (n.length === 1 ? `0${n}` : n)

export const getYyyyMmDd = (date: string) => {
  return new Intl.DateTimeFormat('fi')
    .format(Date.parse(date))
    .split(/\./g)
    .reverse()
    .map(part => prefix(part))
    .join('-')
}
