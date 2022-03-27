# nodejs-challenge

assignment NodeJS challenge

## Installation

pull code from github

```bash
git pull https://github.com/Kadphol/nodejs-challenge.git
```

install npm modules (required [Node.js](https://nodejs.org/))

```bash
npm install
```

## Start server

testing with coverage before starting server

```bash
npm run start
```

testing

``` bash
npm run test
```

testing with coverage

```bash
npm run test:coverage
```

testing with coverage and output to test.html

```bash
npm run test:coverage:html
```

## Usage

After running server, you can see application run showing pagination  dataTable 10 per page of nodejs repository search [http://localhost:3000](http://localhost:3000) or pagination.js list of 10 by 10 [http://localhost:3000/list](http://localhost:3000/list)

API documentation can access through [http://localhost:3000/documentation](http://localhost:3000/documentation)

## Technology

* HapiJS - Node.js Framework. [@hapi/hapi](https://hapi.dev)
  * [@hapi/vision](https://hapi.dev/module/vision/) - HapiJS plugin for template rendering. 
  * [@hapi/inert](https://hapi.dev/module/inert/) - HapiJS plugin for Static file and directory handlers.
  * [@hapi/boom](https://hapi.dev/module/boom/) - HapiJS plugin for HTTP-friendly error objects.
  * [@hapi/lab](https://hapi.dev/module/lab/) - Node test utility.
  * [@hapi/code](https://hapi.dev/module/code/) - BDD asssertion library.
  * [Joi](https://www.npmjs.com/package/joi) - object schema description language and validator for JavaScript objects.
  * [hapi-swagger](https://www.npmjs.com/package/hapi-swagger) - OpenAPI (aka Swagger) plug-in for Hapi.

* [Handlebars](https://handlebarsjs.com)

* [Axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and node.js.

* [nock](https://github.com/nock/nock) - HTTP server mocking and expectations library for Node.js

* [jQuery](https://jquery.com) - javascript library for HTML document traversal and manipulation, event handling, animation, and Ajax.

* [Pagination.js](https://pagination.js.org) - A jQuery plugin to provide simple yet fully customisable pagination.

* [DataTable](https://datatables.net) - A jQuery plugin for HTML Tables
