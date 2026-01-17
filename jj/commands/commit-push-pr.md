---
description: Commit, create bookmarks, push, and create PRs in one workflow
model: claude-sonnet-4-5
tools: Skill(jj:commit), Bash(jj status:*), Bash(jj git remote list:*), Bash(jj log:*), Bash(jj bookmark create:*), Bash(jj bookmark track:*), Bash(jj git push:*), Bash(gh api user:*), Bash(gh pr list:*), Bash(gh pr create:*)
---

# Commit, Push, and Create PRs

Execute the complete workflow from uncommitted changes to open pull requests:

1. **Commit** - Describe changes with proper commit messages
2. **Bookmark** - Create bookmarks for the stack
3. **Push & PR** - Push to origin and create/update pull requests

## Phase 1: Assess Current State

Gather all information upfront:

```bash
gh api user -q '.login'
jj git remote list
jj status --no-pager
jj log --no-pager -r 'trunk()..@'
jj log -r 'trunk()..@' --no-graph -T 'separate(" | ", change_id.short(), if(description, description.first_line(), "(no description)"), bookmarks) ++ "\n"'
gh pr list --json number,title,headRefName,url,baseRefName --state open
```

Identify:
- Commits in the stack and which need descriptions
- Existing bookmarks and which commits should have them
- Existing PRs and which bookmarks need new ones
- GitHub username for bookmark prefix

## Phase 2: Ask All Questions Upfront

Present the current state summary, then ask ALL applicable questions before executing:

**Bookmark configuration** (if bookmarks needed):
- One bookmark for all changesets, or multiple bookmarks?
- Bookmark name prefix (default: `<github-username>/`)

**PR configuration** (if creating new PRs):
- One PR for all changes, or one PR per bookmark?
- Stacked vs independent PRs
- Draft vs published
- Remote to push to (default: `origin`)

Wait for answers before proceeding.

## Phase 3: Execute Workflow

Execute without additional confirmation prompts.

**Step 1: Commit** - Invoke `/jj:commit` with the appropriate revset (skip if all commits have descriptions)

**Step 2: Create Bookmarks** (skip if commits already have bookmarks)

```bash
jj bookmark create <prefix><name> -r <change_id>
jj bookmark track <bookmark> --remote=<remote>
```

**Step 3: Push and Create PRs** (skip if no bookmarks need PRs)

```bash
jj git push
gh pr create --head <bookmark> --base <base> --title "<title>" --body "<body>"
```

## Phase 4: Summary

Present final results:
- Commits described
- Bookmarks created
- PRs created/updated (with URLs)

## Rules

- NEVER add co-author information or Claude attribution
- Do NOT include a "Test plan" section in PR descriptions
- Complete each phase fully before proceeding
- On failure, report the error and ask how to proceed

## Error Handling

- **No changes**: Inform user if working copy is empty and no commits in stack
- **trunk() not configured**: Fall back to `main@origin` or `master@origin`
- **Phase failure**: Report which phase failed with the specific error; ask to retry or skip

## Guidelines

- Minimize questions; use sensible defaults
- Sub-commands handle their own user interactions
- Focus on orchestration, not reimplementing sub-commands
- Call multiple tools in a single response when possible
