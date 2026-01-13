---
description: Commit, create bookmarks, push, and create PRs in one workflow
model: claude-sonnet-4-5
tools: Skill(jj:commit), Bash(jj status:*), Bash(jj git remote list:*), Bash(jj log:*), Bash(jj bookmark create:*), Bash(jj bookmark track:*), Bash(jj git push:*), Bash(gh api user:*), Bash(gh pr list:*), Bash(gh pr create:*) 
---

# Commit, Push, and Create PRs

You are tasked with executing the complete workflow from uncommitted changes to open pull requests.

This command orchestrates three separate operations in sequence:
1. **Commit** - Describe changes with proper commit messages
2. **Bookmark** - Create bookmarks for the stack
3. **Push & PR** - Push to origin and create/update pull requests

## Process

### Phase 1: Assess Current State

Gather all information upfront:

```bash
# Get GitHub username for bookmark prefix
gh api user -q '.login'

# List remotes
jj git remote list

# View current working copy status
jj status --no-pager

# View the current stack
jj log --no-pager -r 'trunk()..@'

# List commits with descriptions and bookmarks
jj log -r 'trunk()..@' --no-graph -T 'separate(" | ", change_id.short(), if(description, description.first_line(), "(no description)"), bookmarks) ++ "\n"'

# Check for existing PRs
gh pr list --json number,title,headRefName,url,baseRefName --state open
```

Identify:
- How many commits are in the stack
- Which commits need descriptions
- Which commits already have bookmarks
- Which commits should have bookmarks (not every commit needs one)
- Which bookmarks already have PRs
- The GitHub username for bookmark prefix

### Phase 2: Ask All Questions Upfront

Present the current state and ask ALL configuration questions before executing anything:

```
Current state:
- [N] commits in stack (trunk()..@)
- [X] commits need descriptions
- [Y] commits need bookmarks
- [Z] PRs to create/update
```

**Ask these questions (as applicable):**

1. **Bookmark configuration:**
   - break previous commits into multiple bookmarks, or one bookmark for the all changesets (if a bookmark isn't present)
   - prefix of bookmark names to create (default: `<github-username>/`). Ask this only if bookmarks are needed.

2. **PR configuration:** (only if creating new PRs)
   - One PR for all changes, or one PR per bookmark
   - Stacked vs independent PRs
   - Draft vs published
   - Remote to push to (default: `origin`)

Wait for user to answer all questions before proceeding.

### Phase 3: Execute Workflow

Execute each phase in sequence. Do NOT ask for additional confirmation during execution.

**Step 1: Commit (if commits need descriptions)**

Invoke `/jj:commit` with the appropriate revset.

**Step 2: Create Bookmarks (if commits need bookmarks)**

Create bookmarks using the prefix confirmed in Phase 2. Do not ask additional questions.

```bash
jj bookmark create <prefix><name> -r <change_id>
jj bookmark track <bookmark> --remote=<remote>
```

An example would look like:

```bash
jj bookmark create jeffh/feature-xyz -r abc1234
jj bookmark track jeffh/feature-xyz --remote=origin
```

**Step 3: Push and Create PRs**

Push and create PRs using the configuration confirmed in Phase 2.

```bash
jj git push
gh pr create --head <bookmark> --base <base> --title "<title>" --body "<body>"
```

### Phase 4: Summary

After all phases complete, present a final summary:

```
Workflow complete!

Commits described: [list]
Bookmarks created: [list]
PRs created/updated: [list with URLs]

All changes are now in open pull requests.
```

## Skip Conditions

- **Skip commit phase** if all commits already have descriptions
- **Skip bookmark phase** if current commit has bookmarks or the user requested
- **Skip PR phase** if no bookmarks need PRs

## Important Rules

- **NEVER add co-author information or Claude attribution**
- **Do NOT include a "Test plan" section in PR descriptions**
- Commits and PRs should be authored solely by the user
- Each phase should complete fully before proceeding to the next
- If any phase fails, report the error and ask how to proceed

## Error Handling

**No changes to commit:**
- If working copy is empty and no commits in stack, inform user

**trunk() not configured:**
- Fall back to `main@origin` or `master@origin`

**Phase failure:**
- Report which phase failed and the specific error
- Ask user if they want to retry or skip that phase

## Remember

- This is a streamlined workflow - minimize questions
- Use sensible defaults based on context
- The user trusts your judgment
- Each sub-command handles its own user interactions
- Focus on orchestration, not reimplementing the sub-commands
- You have the capability to call multiple tools in a single response. You MUST do all of the above in a single message. Do not use any other tools or do anything else. Do not send any other text or messages besides these tool calls.
