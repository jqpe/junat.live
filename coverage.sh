#!/bin/sh

set -e

trap 'kill $(jobs -p) 2>/dev/null' EXIT

run_coverage() {
    local project=$1
    local filter=$2

    NEXT_PUBLIC_DIGITRANSIT_KEY="$NEXT_PUBLIC_DIGITRANSIT_KEY"\
     pnpm dlx serve $project/storybook-static -L -p 6006 &
    pnpm dlx wait-on tcp:6006 && pnpm -F $project "$filter"

    kill $(lsof -t -i:6006) 2>/dev/null || true
}

NEXT_PUBLIC_DIGITRANSIT_KEY="$NEXT_PUBLIC_DIGITRANSIT_KEY"\
 pnpm build-storybook

run_coverage "./site" "/coverage-storybook/"
run_coverage "./packages/ui" "/coverage-storybook/"

pnpm coverage
