Adding a locale: 

1. Copy `en.json` as a starting point (or your native language)
2. Add the locale to `src/constants.ts`, it should be the filename `<locale>.json`, also modify the JSDOC type annotation
3. Run `pnpm test 'locales'`.

## Interpolation

Strings that require interpolation are to be prefixed with `$`, the string then shall contain one or more keys wrapped by curly brackets:

```js
const obj = {
    "$greet": "Hello {{where}}"
}

interpolateString(obj.$greet, {where: "there"}) // -> Hello there
```