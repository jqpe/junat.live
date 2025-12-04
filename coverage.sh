#!/bin/sh

set -e

trap 'cleanup' EXIT

cleanup() {
    jobs -p | xargs -r kill 2>/dev/null || true
    lsof -t -i:6006 2>/dev/null | xargs -r kill 2>/dev/null || true
    wait 2>/dev/null || true
}

run_coverage() {
    local project=$1
    local filter=$2

    pnpm dlx serve $project/storybook-static -L -p 6006 &
    server_pid=$!
    
    pnpm dlx wait-on tcp:6006 && pnpm -F $project "$filter"
    
    kill $server_pid 2>/dev/null || true
    wait $server_pid 2>/dev/null || true
    
    sleep 1
}

pnpm build-storybook

run_coverage "./site" "/coverage-storybook/"
run_coverage "./packages/ui" "/coverage-storybook/"

# Unit tests
pnpm coverage
