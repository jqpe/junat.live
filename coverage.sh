#!/bin/sh

trap 'kill $(jobs -p) 2>/dev/null' EXIT

run_coverage() {
    local project=$1
    local filter=$2

    pnpm dlx serve $project/storybook-static -L -p 6006 &
    pnpm dlx wait-on tcp:6006 && pnpm -F $project "$filter"

    kill $(lsof -t -i:6006) 2>/dev/null || true
}

pnpm build-storybook

run_coverage "./site" "/coverage-storybook/"
run_coverage "./packages/ui" "/coverage-storybook/"

# Unit tests
pnpm coverage
