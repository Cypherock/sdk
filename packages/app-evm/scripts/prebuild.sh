#!/bin/bash

set -e

rm -rf ./src/proto/generated/*.ts || true
rm -rf ./src/proto/generated/evm || true

mkdir -p src/proto/generated

if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
  protoc --plugin=protoc-gen-ts_proto=$(pwd)/node_modules/.bin/protoc-gen-ts_proto.cmd --ts_proto_out=./src/proto/generated ../../submodules/common/proto/evm/*.proto -I../../submodules/common/proto --ts_proto_opt=forceLong=string --ts_proto_opt=esModuleInterop=true
else
  protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./src/proto/generated ../../submodules/common/proto/evm/*.proto -I../../submodules/common/proto --ts_proto_opt=forceLong=string --ts_proto_opt=esModuleInterop=true
fi

node ../../scripts/extractTypes/index.js ./src/proto/generated ./src/proto/generated/types.ts
