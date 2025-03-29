#!/bin/sh

trap 'kill $(jobs -p) 2>/dev/null' EXIT

run_coverage() {
    local project=$1
    local filter=$2

    pnpm dlx serve $project/storybook-static -L -p 6006 &
    pnpm dlx wait-on tcp:6006 && pnpm -F $project "$filter"

    pnpx nyc report --reporter=lcovonly -t $project/coverage --report-dir coverage/
    pnpm shx mv coverage/lcov.info coverage/sb-$(basename $project).lcov.info

    kill $(lsof -t -i:6006) 2>/dev/null || true
}

pnpm shx rm -rf "coverage/**"
pnpm build-storybook

run_coverage "./site" "/coverage-storybook/"
run_coverage "./packages/ui" "/coverage-storybook/"

# Unit tests
pnpm coverage

for file in $(find . -not -path "*/node_modules/*" -name "coverage-final.json"); do
    project=$(dirname $(dirname $file))
    pnpx nyc report --reporter=lcovonly -t $project/coverage --report-dir coverage/
    pnpm shx mv coverage/lcov.info coverage/$(basename $project).lcov.info
done
