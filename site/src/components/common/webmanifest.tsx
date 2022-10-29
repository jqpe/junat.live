import Head from 'next/head'

interface WebmanifestMetaProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  id?: string
  startUrl?: string
  shortName?: string
  name?: string
  /**
   * If any of the properties contain a non-constant value use this prop to defer rendering the manifest link until that value is true.
   *
   * Expects a boolean so passing undefined directly works as if the prop wasn't passed. Convert a truthy value to boolean explicitly e.g. `!!falsy`.
   */
  shouldRender?: boolean
}

export default function Webmanifest({
  shouldRender,
  ...queryParams
}: WebmanifestMetaProps) {
  return (
    <Head>
      {shouldRender !== false && (
        <link
          rel="manifest"
          href={`/api/site.webmanifest?${new URLSearchParams(queryParams)}`}
        />
      )}
    </Head>
  )
}
