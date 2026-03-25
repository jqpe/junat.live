#!/bin/sh

set -e

# Array to track server PIDs for cleanup
SERVER_PIDS=""

cleanup() {
    if [ -n "$SERVER_PIDS" ]; then
        for pid in $SERVER_PIDS; do
            kill "$pid" 2>/dev/null || true
        done
    fi
    # Also kill any remaining background jobs
    jobs -p | xargs -r kill 2>/dev/null || true
}

trap cleanup EXIT INT TERM

run_coverage() {
    local project=$1
    local filter=$2
    local port=$3
    
    pnpm dlx serve "$project/storybook-static" -L -p "$port" &
    local server_pid=$!
    SERVER_PIDS="$SERVER_PIDS $server_pid"
    
    if pnpm dlx wait-on "tcp:$port" --timeout 30000; then
        pnpm -F "$project" "$filter" || {
            echo "Coverage failed for $project"
            return 1
        }
    else
        echo "Failed to start server on port $port for $project"
        return 1
    fi

    kill "$server_pid" 2>/dev/null || true
    SERVER_PIDS=$(echo "$SERVER_PIDS" | sed "s/$server_pid//")
}

pnpm build-storybook

run_coverage "./site" "/coverage-storybook/" 6006 &
SITE_PID=$!

run_coverage "./packages/ui" "/coverage-storybook/" 6007 &
UI_PID=$!

wait $SITE_PID
SITE_EXIT=$?

wait $UI_PID
UI_EXIT=$?

if [ $SITE_EXIT -ne 0 ] || [ $UI_EXIT -ne 0 ]; then
    echo "One or more storybook coverage tasks failed"
    exit 1
fi

pnpm coverage
