declare module '*.webmanifest' {
  type JSONValue = string | number | boolean | null | JSONObject | JSONArray

  interface JSONObject {
    [x: string]: JSONValue
  }

  interface JSONArray extends Array<JSONValue> {}

  const value: JSONObject
  export default value
}
