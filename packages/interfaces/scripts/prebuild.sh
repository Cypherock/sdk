#!/bin/bash

set -e

rm -rf ./src/proto/generated/*.ts || true

mkdir -p src/proto/generated

if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
  protoc --plugin=protoc-gen-ts_proto=$(pwd)/node_modules/.bin/protoc-gen-ts_proto.cmd  --ts_proto_out=./src/proto/generated ../../submodules/common/proto/error.proto -I../../submodules/common/proto
else
  protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./src/proto/generated ../../submodules/common/proto/error.proto -I../../submodules/common/proto
fi

node ../../scripts/extractTypes/index.js ./src/proto/generated ./src/proto/generated/types.ts
