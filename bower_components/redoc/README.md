# ReDoc
**OpenAPI/Swagger-generated API Reference Documentation**

[![Build Status](https://travis-ci.org/Rebilly/ReDoc.svg?branch=master)](https://travis-ci.org/Rebilly/ReDoc) [![Coverage Status](https://coveralls.io/repos/Rebilly/ReDoc/badge.svg?branch=master&service=github)](https://coveralls.io/github/Rebilly/ReDoc?branch=master) [![Tested on APIs.guru](http://api.apis.guru/badges/tested_on.svg)](https://APIs.guru) [![Code Climate](https://codeclimate.com/github/Rebilly/ReDoc/badges/gpa.svg)](https://codeclimate.com/github/Rebilly/ReDoc) [![David](https://david-dm.org/Rebilly/ReDoc/dev-status.svg)](https://david-dm.org/Rebilly/ReDoc#info=devDependencies) [![Stories in Ready](https://badge.waffle.io/Rebilly/ReDoc.png?label=ready&title=Ready)](https://waffle.io/Rebilly/ReDoc)

[![npm](http://img.shields.io/npm/v/redoc.svg)](https://www.npmjs.com/package/redoc) [![Bower](http://img.shields.io/bower/v/redoc.svg)](http://bower.io/) [![License](https://img.shields.io/npm/l/redoc.svg)](https://github.com/Rebilly/ReDoc/blob/master/LICENSE)

[![Browser Compatibility](https://saucelabs.com/browser-matrix/redoc.svg)](https://saucelabs.com/u/redoc)

![ReDoc demo](demo/redoc-demo.png)

## [Live demo](http://rebilly.github.io/ReDoc/)

## Features
- Extremely easy deployment
- It’s free and open-source project under MIT license
- The widest OpenAPI features support (yes, it supports even discriminator)
- Neat documentation for nested objects
- Code samples support (via vendor extension)
- Responsive three-panel design with menu/scrolling synchronization
- Integrate API introduction into side menu - ReDoc takes advantage of markdown headings from OpenAPI description field. It pulls them into side menu and also supports deep linking.

## Roadmap
  - [ ] docs pre-rendering (performance and SEO)
  - [ ] ability to simple customization
  - [ ] built-in API Console

## Releases
We host latest and all the previous ReDoc releases on GitHub Pages-based **CDN**:
- particular release, e.g. `v1.2.0`: https://rebilly.github.io/ReDoc/releases/v1.2.0/redoc.min.js
- `v1.x.x` release: https://rebilly.github.io/ReDoc/releases/v1.x.x/redoc.min.js
- `latest` release: https://rebilly.github.io/ReDoc/releases/latest/redoc.min.js **[not for production]**

## Deployment

### TL;DR

```html
<!DOCTYPE html>
<html>
  <head>
    <title>ReDoc</title>
    <!-- needed for adaptive design -->
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!--
    ReDoc doesn't change outer page styles
    -->
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <redoc spec-url='http://petstore.swagger.io/v2/swagger.json'></redoc>
    <script src="https://rebilly.github.io/ReDoc/releases/latest/redoc.min.js"> </script>
  </body>
</html>
```
That's all folks!

### 1. Install ReDoc (skip this step for CDN)
Install using [bower](bower.io):

    bower install redoc

or using [npm](https://docs.npmjs.com/getting-started/what-is-npm):

    npm install redoc --save

### 2. Reference redoc script in HTML
For **CDN**:
```html
<script src="https://rebilly.github.io/ReDoc/releases/latest/redoc.min.js"> </script>
```

For bower:
```html
<script src="bower_components/redoc/dist/redoc.min.js"> </script>
```
For npm:
```html
<script src="node_modules/redoc/dist/redoc.min.js"> </script>
```

### 3. Add `<redoc>` element to your page
```html
<redoc spec-url="url/to/your/spec"></redoc>
```

### 4. Enjoy :smile:

## Configuration

### Swagger vendor extensions
ReDoc makes use of the following [vendor extensions](http://swagger.io/specification/#vendorExtensions):
* [`x-logo`](docs/redoc-vendor-extensions.md#x-logo) - is used to specify API logo
* [`x-traitTag`](docs/redoc-vendor-extensions.md#x-traitTag) - useful for handling out common things like Pagination, Rate-Limits, etc
* [`x-code-samples`](docs/redoc-vendor-extensions.md#x-code-samples) - specify operation code samples
* [`x-nullable`](docs/redoc-vendor-extensions.md#nullable) - mark schema param as a nullable

### `<redoc>` tag attributes
* `spec-url` - relative or absolute url to your spec file;
* `scroll-y-offset` - If set, specifies a vertical scroll-offset. This is often useful when there are fixed positioned elements at the top of the page, such as navbars, headers etc;
`scroll-y-offset` can be specified in various ways:
  * **number**: A fixed number of pixels to be used as offset;
  * **selector**: selector of the element to be used for specifying the offset. The distance from the top of the page to the element's bottom will be used as offset;
  * **function**: A getter function. Must return a number representing the offset (in pixels);
* `suppress-warnings` - if set, warnings are not rendered at the top of documentation (they still are logged to the console).

## Advanced usage
Instead of adding `spec-url` attribute to the `<redoc>` element you can initialize ReDoc via globally exposed `Redoc` object:
```js
Redoc.init(specUrl, options)
```

`options` is javascript object with camel-cased version of `<redoc>` tag attribute names as the keys, e.g.:
```js
Redoc.init('http://petstore.swagger.io/v2/swagger.json', {
  scrollYOffset: 50
})
```

-----------
## Development
#### Running local dev-server
1. Clone repository
`git clone https://github.com/Rebilly/ReDoc.git`
2. Go to the project folder
`cd ReDoc`
3. Install node modules and front-end dependencies
```
npm install
npm run jspm-install
```
4. _(optional)_ Replace `demo/swagger.json` with your own schema
5. Start the server
`npm start`
6. Open `http://localhost:9000`
