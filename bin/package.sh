#!/usr/bin/env bash

set -e

cp package.json dist/
cp yarn.lock dist/
cd dist
yarn install --production
cd ..

(
	cd cdk
	npm ci
	npm run lint
	npm test
	npm run synth
)
