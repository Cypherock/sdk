#!/bin/bash

set -e

protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./src/encoders/proto/generated ../../submodules/common/proto/*.proto -I../../submodules/common/proto
