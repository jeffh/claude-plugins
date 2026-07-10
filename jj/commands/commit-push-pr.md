---
description: Gather stack + PR-template context, then run the jj:commit-push-pr skill
allowed-tools: Bash(jj status:*), Bash(jj log:*), Bash(jj git remote list:*), Bash(gh api user:*), Bash(gh pr list:*), Bash(cat:*), Bash(ls:*), Skill(jj:commit-push-pr)
---

## Context

- GitHub user: !`gh api user -q '.login'`
- Remotes: !`jj git remote list`
- Status: !`jj status --no-pager`
- Stack: !`jj log --no-pager -r 'trunk()..@'`
- Stack detail: !`jj log -r 'trunk()..@' --no-graph -T 'separate(" | ", change_id.short(), if(description, description.first_line(), "(no description)"), bookmarks) ++ "\n"'`
- Open PRs: !`gh pr list --json number,title,headRefName,url,baseRefName --state open`
- PR template: !`for f in .github/PULL_REQUEST_TEMPLATE.md .github/pull_request_template.md docs/PULL_REQUEST_TEMPLATE.md PULL_REQUEST_TEMPLATE.md .github/PULL_REQUEST_TEMPLATE/*.md; do [ -f "$f" ] && echo "=== $f ===" && cat "$f"; done; :`

## Your task

All context is gathered above. Invoke the **jj:commit-push-pr** skill to run the full workflow. If a PR template appears above, the skill must fill it out rather than invent a body.
