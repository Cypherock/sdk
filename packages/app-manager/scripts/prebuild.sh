#!/bin/bash

set -e

rm -rf ./src/proto/generated/*.ts || true
rm -rf ./src/proto/generated/manager || true

if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
  protoc --plugin=protoc-gen-ts_proto=$(pwd)/node_modules/.bin/protoc-gen-ts_proto.cmd  --ts_proto_out=./src/proto/generated ../../submodules/common/proto/manager/*.proto -I../../submodules/common/proto
else
  protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./src/proto/generated ../../submodules/common/proto/manager/*.proto -I../../submodules/common/proto
fi

node ./scripts/extractTypes.js
