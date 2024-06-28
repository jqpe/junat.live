## Add a locale

1. Copy `src/en.json` as a starting point (or your native language)
2. Add the locale to `:/packages/core/constants@LOCALES`
3. Run `pnpm test 'locales'`

> [!WARNING]
> Use [UTS Locale Identifiers](https://www.unicode.org/reports/tr35/tr35-59/tr35.html#Identifiers) in the file name. ([reference table](https://en.wikipedia.org/wiki/IETF_language_tag#List_of_common_primary_language_subtags))[^1]
> The file name should be the same as the value used across the application.

## ICU messages

The translations can use the full power of [ICU messages](https://unicode-org.github.io/icu/userguide/format_parse/messages/) for formatting. It's up to caller apps and packages to implement interpolation.

## Interpolation

Strings that require interpolation are to be prefixed with `$`. The string must contain one or more keys wrapped by curly brackets:

```js
const obj = {
  $greet: 'Hello { where }',
}

interpolateString(obj.$greet, { where: 'there' }) // -> Hello there
```

[^1]: While UTS Locale Identifiers and IETF language tags are different concepts, they can be used interchangeably for the most part
