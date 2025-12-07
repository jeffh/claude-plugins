---
name: spec-metadata
description: Gathers metadata for documentation including timestamps, git info, and repository details. Activate when creating research docs, plans, or handoffs that need metadata frontmatter.
allowed-tools:
  - Bash
---

# Spec Metadata Skill

This skill provides instructions for gathering metadata to include in documentation frontmatter (research documents, implementation plans, handoffs, etc.).

## Metadata to Gather

Use the Bash tool to gather the following metadata:

### 1. Current Date/Time with Timezone
```bash
date -u +"%Y-%m-%dT%H:%M:%SZ"
```

### 2. Timestamp for Filename
```bash
date +"%Y-%m-%d_%H-%M-%S"
```

### 3. Simple Date (YYYY-MM-DD)
```bash
date +"%Y-%m-%d"
```

### 4. Git/JJ Information (if in repository)

**For Git users:**
```bash
# Get commit hash
git rev-parse HEAD

# Get current branch name
git branch --show-current

# Get repository name (from remote URL)
git remote get-url origin | sed 's/.*\///' | sed 's/\.git$//'

# Alternative for repository owner/name
gh repo view --json owner,name -q '.owner.login + "/" + .name' 2>/dev/null || git remote get-url origin | sed 's/.*[:/]//' | sed 's/\.git$//'
```

**For Jujutsu (jj) users:**
```bash
# Get commit hash
jj log -r @ --no-graph -T 'commit_id'

# List bookmarks/branches
jj bookmark list

# Get repository name
jj config list --repo | grep -E 'remote.*url' | sed 's/.*\///' | sed 's/\.git$//' | head -n1
```

## Usage Instructions

When you need to gather metadata for a document:

1. Invoke this skill using the Skill tool
2. Run the appropriate bash commands above based on your needs
3. Use the gathered metadata to populate the YAML frontmatter in your document

## Example Frontmatter Template

```yaml
---
date: [ISO timestamp from step 1]
researcher: [Researcher name - get from user context or existing docs]
git_commit: [Commit hash from step 4]
branch: [Branch name from step 4]
repository: [Repository name from step 4]
topic: "[Document topic]"
tags: [relevant, tags, here]
status: complete
last_updated: [Simple date from step 3]
last_updated_by: [Researcher name]
---
```

## Notes

- Not all metadata may be available in every environment (e.g., git info in non-git repos)
- Handle errors gracefully - if git/jj commands fail, proceed without that metadata
- The timestamp format for filenames uses underscores and hyphens for filesystem compatibility
- ISO timestamps should use UTC timezone (Z suffix) for consistency
