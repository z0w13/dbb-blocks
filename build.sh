#!/usr/bin/env bash

pnpm exec tsc
sed -i "s/exports.default/module.exports/" dist/*.js
sed -i "/Object.defineProperty/d" dist/*.js
