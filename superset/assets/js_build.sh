#!/bin/bash
set -e
cd "$(dirname "$0")"
npm --version
node --version
npm install -g yarn
yarn
npm run build
npm run cover
