---
description: Fetch and show the stack, then run the jj:rebase skill to rebase onto trunk
allowed-tools: Bash(jj git fetch:*), Bash(jj log:*), Skill(jj:rebase)
---

## Context

- Fetch: !`jj git fetch`
- Stack root: !`jj log --no-pager -r 'roots(::@ ~ ::trunk())'`
- Current stack: !`jj log --no-pager -r 'trunk()..@'`

## Your task

Latest trunk is fetched above. Invoke the **jj:rebase** skill to rebase the stack onto trunk. If the stack root is empty, report that we're already up to date.
