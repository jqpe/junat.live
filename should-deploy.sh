#!/bin/bash

#
# Deploy a preview deployment on pull requests. Deploy to production on pushes to main.
# Additionally a commit message may include skip-deploy to skipping to both environments.
#

message=$(git log -1 --pretty=%B | cat)

if [[ "$VERCEL_GIT_PULL_REQUEST_ID" != "" || "$VERCEL_GIT_COMMIT_REF" == "main" ]]; then
    if [[ $message == *"skip-deploy"* ]]; then
        exit 0
    else
        exit 1
    fi

else
    # Don't build
    exit 0
fi
