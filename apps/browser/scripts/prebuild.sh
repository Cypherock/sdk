#!/bin/bash

set -e

# browserify bitcoinjs-lib
BASEPATH='src/generated'
npx browserify --standalone bitcoin - -o ${BASEPATH}/bitcoinjs-lib <<<"module.exports = require('bitcoinjs-lib');"
echo "/* eslint-disable */" > ${BASEPATH}/bitcoinjs-lib.js
cat ${BASEPATH}/bitcoinjs-lib >> ${BASEPATH}/bitcoinjs-lib.js
rm ${BASEPATH}/bitcoinjs-lib