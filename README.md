# Product Dashboard

A React + Redux Toolkit product dashboard using the Fake Store API.

## Prerequisites
- Node.js >= 16

## Setup
- npm install
- npm start

## Tests
- npm test
- npm run test:coverage
See coverage reports in ./coverage and open ./coverage/lcov-report/index.html in a browser.

## Build
- npm run build

## Deploy (Netlify)
- Create a new site from this repo on Netlify
- Set build command: `npm run build`
- Set publish directory: `build`
- The SPA redirect is configured via netlify.toml

## Tech
- React 18, React Router 6
- Redux Toolkit, redux-persist
- MUI
- Jest + React Testing Library

# product


# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
