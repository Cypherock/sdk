#!/bin/bash

set -e

# browserify bitcoinjs-lib
basepath='src/generated'
npx browserify --standalone bitcoin - -o ${basepath}/bitcoinjs-lib <<<"module.exports = require('bitcoinjs-lib');"
echo "/* eslint-disable */" > ${basepath}/bitcoinjs-lib.js
cat ${basepath}/bitcoinjs-lib >> ${basepath}/bitcoinjs-lib.js
rm ${basepath}/bitcoinjs-lib