# es6 boilerplate
Front-end project boilerplate with es6 build tools. Includes babel, webpack, and npm scripts.

## Usage
Use [index.js](src/index.js) as your entry point. From there you can write ES6 JavaScript
and import other modules using `import Foo from './foo'` etc. It will be compiled to a 
single ES5 file at `dist/bundle.js` using the commands below, which is then run by
[index.html](index.html).

## Development
Clone this repository and use `npm install` to install dependencies.

Use `npm start` to run a live reload server at `localhost:8080/webpack-dev-server`
and watch for/recompile on changes.

Use `npm run watch` to _only_ watch for/recompile on changes (use your own web server)

Use `npm run build` to compile a minified, production-ready build
