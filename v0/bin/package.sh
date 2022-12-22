#!/usr/bin/env bash

set -e

cp package.json dist/
cp yarn.lock dist/
cd dist
yarn install --production
cd ..

(
	cd cdk
	yarn install
	yarn lint
	yarn test
	yarn synth
)
