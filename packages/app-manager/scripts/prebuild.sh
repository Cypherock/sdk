#!/bin/bash

set -e

rm -rf ./src/proto/generated/*.ts || true
rm -rf ./src/proto/generated/manager || true
protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./src/proto/generated ../../submodules/common/proto/manager/*.proto -I../../submodules/common/proto
