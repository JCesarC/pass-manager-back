# pass-manager-back

#Instructions

##Especifications
Node version 16.17.1
npm version 8.15.0

# commands before webpack
"scripts": {
    "test-webpack": "npx webpack --mode production",
    "build": "npx tsc",
    "dev": "concurrently \"npx tsc --watch\" \"nodemon -q dist/src/server.js\"",
    "lint": "eslint . --ext .ts",
    "lint-fix": "eslint . --ext .ts --fix",
    "start": "node dist/src/server.js",
    "test": "jest",
    "serve:coverage": "npm run test && cd coverage/lcov-report && npx serve",
    "format": "prettier --write ."
  },