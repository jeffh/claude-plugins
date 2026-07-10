---
description: Gather jj context, then hand off to the jj:commit skill to describe changes
argument-hint: "[revset]"
allowed-tools: Bash(jj status:*), Bash(jj diff:*), Bash(jj log:*), Bash(jj config get:*), Bash(git config:*), Skill(jj:commit)
---

## Context

- Status: !`jj status --no-pager`
- Diff: !`jj diff --no-pager`
- Undescribed changes: !`jj log --no-pager -r 'trunk()..@ & description(exact:"")' -T 'change_id ++ "\n"'`
- Recent log: !`jj log --no-pager -r 'ancestors(@, 5)'`
- Commit template: !`jj config get templates.draft_commit_description 2>/dev/null || git config --get commit.template 2>/dev/null || echo none`

## Your task

All jj context is gathered above. Invoke the **jj:commit** skill to describe the change(s), passing `$ARGUMENTS` as the revset when provided. Do not re-run status or diff — use the context above.
