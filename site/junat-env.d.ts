/* eslint-disable unicorn/filename-case */
declare module '*.webmanifest' {
  type JSONValue = string | number | boolean | null | JSONObject | JSONArray

  interface JSONObject {
    [x: string]: JSONValue
  }

  type JSONArray = Array<JSONValue>

  const value: JSONObject
  export default value
}

interface Window {
  __theme: 'light' | 'dark'
  __setPreferredTheme: (theme: 'light' | 'dark') => void
}
