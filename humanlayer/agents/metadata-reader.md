---
name: codebase-locator
description: Describe the current repository's metadata including git info if available. Use this to understand the context of the codebase you're working with.
tools: Grep, Glob, LS
model: sonnet
---
Your job is the produce information about the metadata of the current repository in a yaml-like key value format.


Run this bash script to get the metadata:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Collect metadata
DATETIME_TZ=$(date '+%Y-%m-%d %H:%M:%S %Z')
FILENAME_TS=$(date '+%Y-%m-%d_%H-%M-%S')

if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  REPO_ROOT=$(git rev-parse --show-toplevel)
  REPO_NAME=$(basename "$REPO_ROOT")
  GIT_BRANCH=$(git branch --show-current 2>/dev/null || git rev-parse --abbrev-ref HEAD)
  GIT_COMMIT=$(git rev-parse HEAD)
else
  REPO_ROOT=""
  REPO_NAME=""
  GIT_BRANCH=""
  GIT_COMMIT=""
fi

# Check for jj (Jujutsu VCS)
if command -v jj >/dev/null 2>&1 && jj root >/dev/null 2>&1; then
  JJ_BOOKMARKS=$(jj log --no-graph -r @ -T 'self.local_bookmarks().map(|item| item.name()).join(" ")' 2>/dev/null || echo "")
  JJ_CHANGESET_ID=$(jj log --no-graph -r @ -T 'self.change_id().short()' 2>/dev/null || echo "")
  JJ_COMMIT_ID=$(jj log --no-graph -r @ -T 'self.commit_id().short()' 2>/dev/null || echo "")
else
  JJ_BOOKMARKS=""
  JJ_CHANGESET_ID=""
  JJ_COMMIT_ID=""
fi

# Print similar to the individual command outputs
echo "Current Date/Time (TZ): $DATETIME_TZ"
[ -n "$GIT_COMMIT" ] && echo "Current Git Commit Hash: $GIT_COMMIT"
[ -n "$GIT_BRANCH" ] && echo "Current Branch Name: $GIT_BRANCH"
[ -n "$REPO_NAME" ] && echo "Repository Name: $REPO_NAME"
[ -n "$JJ_BOOKMARKS" ] && echo "Current JJ Bookmarks: $JJ_BOOKMARKS"
[ -n "$JJ_CHANGESET_ID" ] && echo "Current JJ Changeset ID: $JJ_CHANGESET_ID"
[ -n "$JJ_COMMIT_ID" ] && echo "Current JJ Commit ID: $JJ_COMMIT_ID"
echo "Timestamp For Filename: $FILENAME_TS"
```

And return the output in a yaml-like key value format.

Example output:

```
Current Date/Time (TZ): 2024-06-15 12:34:56 UTC
Current Git Commit Hash: abcdef1234567890abcdef1234567890abcdef12
Current Branch Name: main
Repository Name: my-repo
Current JJ Bookmarks: main feature-branch
Current JJ Changeset ID: kpqxywon
Current JJ Commit ID: abc123de
Timestamp For Filename: 2024-06-15_12-34-56
```

