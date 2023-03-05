#!/bin/bash

#
# Deploy a preview deployment on pull requests. Deploy to production on pushes to main.
#

if [[ "$VERCEL_GIT_PULL_REQUEST_ID" != "" || "$VERCEL_GIT_COMMIT_REF" == "main" ]]; then
    # Proceed with the build
    exit 1

else
    # Don't build
    exit 0
fi
