#!/bin/bash

# NOTE: all whitespace will be replaced with a semicolon. (regardless of it being surrounded by quotes)
read -d '' json <<-EOM
this.dependencies=undefined
this.private=false
this.publishConfig=undefined
this.devDependencies=undefined
this.scripts=undefined
this.prettier=undefined
this.main="./index.js"
this.types="./indexd.d.ts"
this.files=["**"]
EOM

pnpm json -I -f dist/package.json -e $(echo $json | tr [:blank:] ';')
