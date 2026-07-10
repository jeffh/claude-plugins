---
name: commit-push-pr
description: Run the full jj-to-PR workflow — describe changes, create per-commit bookmarks, push to origin, and open stacked pull requests with sensible defaults. This skill should be used when the user wants to "commit and open a PR", "push and create PRs", or ship a jj stack. Fills out a repo PR template (.github/PULL_REQUEST_TEMPLATE.md) when present; never adds Claude attribution or a Test plan section unless the template asks for it. Not for plain commits (use jj:commit) or rebasing (use jj:rebase).
---

# Commit, Push, and Create PRs

Execute the complete workflow from uncommitted changes to open pull requests:

1. **Commit** — Describe changes with proper commit messages
2. **Bookmark** — Create bookmarks for the stack
3. **Push & PR** — Push to origin and create/update pull requests

## Context expectations

When invoked from `/jj:commit-push-pr`, the GitHub user login, remotes, working-copy status, stack log, open PRs, and any repo PR template are **already in context**. Do not re-fetch them. If invoked directly, gather them first:

```bash
gh api user -q '.login'
jj git remote list
jj status --no-pager
jj log --no-pager -r 'trunk()..@'
jj log -r 'trunk()..@' --no-graph -T 'separate(" | ", change_id.short(), if(description, description.first_line(), "(no description)"), bookmarks) ++ "\n"'
gh pr list --json number,title,headRefName,url,baseRefName --state open
```

From that context, identify: commits needing descriptions, existing bookmarks, existing PRs, and the GitHub username for the bookmark prefix.

## Defaults (no prompting)

**Bookmarks:**
- One bookmark per commit in the stack
- Prefix `<github-username>/`; name derived from the commit description (lowercase, dash-separated)

**PRs:**
- One PR per bookmark (stacked PRs)
- Base each PR on its parent bookmark (or trunk for the first PR)
- Published (not draft), pushed to `origin`

## Steps

Execute without additional confirmation prompts.

**Step 1: Commit** — Invoke the `jj:commit` skill with the appropriate revset (skip if all commits have descriptions).

**Step 2: Create Bookmarks** (skip if commits already have bookmarks):

```bash
jj bookmark create <prefix><name> -r <change_id>
jj bookmark track <bookmark> --remote=origin
```

**Step 3: Push and Create PRs** (skip if no bookmarks need PRs):

```bash
jj git push
gh pr create --head <bookmark> --base <base> --title "<title>" --body "<body>"
```

## Honor PR templates

If a PR template was found in context (e.g. `.github/PULL_REQUEST_TEMPLATE.md`), use its sections and checkboxes verbatim as the PR body, filling each section from the actual changes. When **no** template exists, write a concise body and do **NOT** include a "Test plan" section.

## Rules

- NEVER add co-author information or Claude attribution
- Complete each step fully before proceeding
- On failure, report the specific error and ask how to proceed (retry or skip)

## Error handling

- **No changes**: Inform the user if the working copy is empty and no commits are in the stack
- **trunk() not configured**: Fall back to `main@origin`, then `master@origin`
- **Step failure**: Report which step failed with the specific error

## Summary

Present final results: commits described, bookmarks created, and PRs created/updated (with URLs).
