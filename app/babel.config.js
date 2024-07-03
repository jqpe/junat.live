/** @type {import("@babel/core").ConfigFunction} */
const babel = api => {
  api.cache(true)
  return {
    presets: [['babel-preset-expo']],
  }
}

module.exports = babel
