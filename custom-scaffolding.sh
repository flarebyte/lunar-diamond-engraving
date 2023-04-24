#!/bin/bash

npx zx --install https://raw.githubusercontent.com/flarebyte/baldrick-reserve/main/reserve-schema/schema-to-md.mjs --schema spec/snapshots/engraving-model/get-schema--schema.json --md SCHEMA.md --title "lunar-diamond-engraving"
npx baldrick-broth@latest md fix