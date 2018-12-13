<div align="center">
  
  [![npm package @latest](https://img.shields.io/npm/v/hoast-minify.svg?label=npm@latest&style=flat-square&maxAge=3600)](https://npmjs.com/package/hoast-minify)
  [![npm package @next](https://img.shields.io/npm/v/hoast-minify/next.svg?label=npm@next&style=flat-square&maxAge=3600)](https://npmjs.com/package/hoast-minify/v/next)
  
  [![Travis-ci status](https://img.shields.io/travis-ci/com/hoast/hoast-minify.svg?branch=master&label=test%20status&style=flat-square&maxAge=3600)](https://travis-ci.com/hoast/hoast-minify)
  [![CodeCov coverage](https://img.shields.io/codecov/c/github/hoast/hoast-minify/master.svg?label=test%20coverage&style=flat-square&maxAge=3600)](https://codecov.io/gh/hoast/hoast-minify)
  
  [![License agreement](https://img.shields.io/github/license/hoast/hoast-minify.svg?style=flat-square&maxAge=86400)](https://github.com/hoast/hoast-minify/blob/master/LICENSE)
  [![Open issues on GitHub](https://img.shields.io/github/issues/hoast/hoast-minify.svg?style=flat-square&maxAge=86400)](https://github.com/hoast/hoast-minify/issues)
  
</div>

# hoast-minify

Minify CSS, HTML, and JS files using `clean-css`, `html-minifier`, and `terser` respectively.

> As the name suggest this is a [hoast](https://github.com/hoast/hoast#readme) module.

## Usage

Install [hoast-minify](https://npmjs.com/package/hoast-minify) using [npm](https://npmjs.com).

```
$ npm install --save hoast-minify
```

### Parameters

* `css`: Options for [`clean-css`](https://github.com/jakubpawlowicz/clean-css#constructor-options).
  * Type: `Object`
	* Default: `{}`
* `html`: Options for [`html-minifier`](https://github.com/kangax/html-minifier#options-quick-reference).
  * Type: `Object`
	* Default: `{ collapseWhitespace: true, removeComments: true }`
* `js`: Options for [`terser`](https://github.com/terser-js/terser#minify-options).
  * Type: `Object`
	* Default: `{}`
* `patternsCSS`: Glob patterns to match file paths with that will be processed by `clean-css`.
  * Type: `String` or `Array of strings`
	* Default: `[ '*.css' ]`
* `patternsHTML`: Glob patterns to match file paths with that will be processed by `html-minifier`.
  * Type: `String` or `Array of strings`
	* Default: `[ '*.html' ]`
* `patternsJS`: Glob patterns to match file paths with that will be processed by `terser`.
  * Type: `String` or `Array of strings`
	* Default: `[ '*.js' ]`
* `patternOptions`: Options for the glob pattern matching. See [planckmatch options](https://github.com/redkenrok/node-planckmatch#options) for more details on the pattern options.
  * Type: `Object`
  * Default: `{}`
* `patternOptions.all`: This options is added to `patternOptions`, and determines whether all patterns need to match instead of only one.
  * Type: `Boolean`
  * Default: `false`

> The `css` and `js` options will also be given to the `html-minifier` to use for CSS and JS content within HTML files.

### Examples

**CLI**

```json
{
  "modules": {
    "read": {},
    "hoast-minify": {}
  }
}
```

**Script**

```javascript
const Hoast = require(`hoast`);
const read = Hoast.read,
      minify = require(`hoast-minify`);

Hoast(__dirname)
  .use(read())
  .use(minify())
  .process();
```