---
description: Configure GitHub branch protection rulesets for the default branch
---

# Set GitHub Branch Ruleset

You are tasked with creating or updating a GitHub branch ruleset to protect the default branch.

## Process

### 1. Get Repository Information

```bash
# Get repository details
gh repo view --json name,owner,defaultBranchRef

# Get existing rulesets (if any)
gh api repos/{owner}/{repo}/rulesets --jq '.[] | {id, name, enforcement}'
```

### 2. Check Available GitHub Actions

Run this to discover available workflow job names that can be used as status checks:

```bash
# List workflow files
gh api repos/{owner}/{repo}/actions/workflows --jq '.workflows[] | {name: .name, path: .path}'

# For each workflow, you can inspect jobs by reading the workflow file
```

Also check the repository's `.github/workflows/` directory to understand job names.

### 3. Ask User for Configuration

Use AskUserQuestion to ask the user:

**Question 1: Protection Type**
- "Use Status Checks (require CI jobs to pass)" - Default, recommended if GitHub Actions exist
- "Use Code Scanning Results (require security analysis)" - Use GitHub Advanced Security code scanning

**If Status Checks selected and GitHub Actions exist:**

**Question 2: Which Status Checks to Require**
Present the discovered workflow job names and ask which ones to require. Common patterns:
- Build/Test jobs (e.g., "Test and Build", "CI")
- Lint/Format jobs (e.g., "Format and Lint", "Lint")

**If no GitHub Actions exist:**
Inform the user that no GitHub Actions were found, so status checks will be skipped. The ruleset will only enforce deletion and non-fast-forward rules.

### 4. Create the Ruleset

Use the GitHub API to create the ruleset:

```bash
gh api repos/{owner}/{repo}/rulesets \
  --method POST \
  --input - << 'EOF'
{
  "name": "Protect default branch",
  "target": "branch",
  "enforcement": "active",
  "bypass_actors": [],
  "conditions": {
    "ref_name": {
      "exclude": [],
      "include": ["~DEFAULT_BRANCH"]
    }
  },
  "rules": [
    {
      "type": "deletion"
    },
    {
      "type": "non_fast_forward"
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "do_not_enforce_on_create": false,
        "strict_required_status_checks_policy": false,
        "required_status_checks": [
          {
            "context": "Format and Lint",
            "integration_id": 15368
          },
          {
            "context": "Test and Build",
            "integration_id": 15368
          }
        ]
      }
    }
  ]
}
EOF
```

**Note:** `integration_id: 15368` is GitHub Actions. Adjust the `context` values based on the user's workflow job names.

### Alternative: Code Scanning Rule

If user chooses Code Scanning Results instead of Status Checks:

```bash
gh api repos/{owner}/{repo}/rulesets \
  --method POST \
  --input - << 'EOF'
{
  "name": "Protect default branch",
  "target": "branch",
  "enforcement": "active",
  "bypass_actors": [],
  "conditions": {
    "ref_name": {
      "exclude": [],
      "include": ["~DEFAULT_BRANCH"]
    }
  },
  "rules": [
    {
      "type": "deletion"
    },
    {
      "type": "non_fast_forward"
    },
    {
      "type": "code_scanning",
      "parameters": {
        "code_scanning_tools": [
          {
            "tool": "CodeQL",
            "security_alerts_threshold": "high_or_higher",
            "alerts_threshold": "errors"
          }
        ]
      }
    }
  ]
}
EOF
```

### Alternative: Minimal Ruleset (No CI)

If no GitHub Actions exist and user doesn't want code scanning:

```bash
gh api repos/{owner}/{repo}/rulesets \
  --method POST \
  --input - << 'EOF'
{
  "name": "Protect default branch",
  "target": "branch",
  "enforcement": "active",
  "bypass_actors": [],
  "conditions": {
    "ref_name": {
      "exclude": [],
      "include": ["~DEFAULT_BRANCH"]
    }
  },
  "rules": [
    {
      "type": "deletion"
    },
    {
      "type": "non_fast_forward"
    }
  ]
}
EOF
```

### 5. Verify the Ruleset

After creation, verify it was set up correctly:

```bash
# List all rulesets
gh api repos/{owner}/{repo}/rulesets --jq '.[] | {id, name, enforcement}'

# Get details of the created ruleset
gh api repos/{owner}/{repo}/rulesets/{ruleset_id}
```

## Default Configuration Summary

The default ruleset includes:

| Setting | Value |
|---------|-------|
| Enforcement | Active |
| Bypass actors | None (cannot be bypassed) |
| Target branches | Default branch only |
| Prevent deletion | Yes |
| Prevent non-fast-forward | Yes |
| Required status checks | Based on available GitHub Actions |

## Important Notes

- **Integration ID 15368** is the GitHub Actions integration. Use this for all status checks that come from GitHub Actions workflows.
- **~DEFAULT_BRANCH** is a special pattern that matches whatever the repository's default branch is (main, master, etc.)
- Rulesets cannot be bypassed when `bypass_actors` is empty
- If updating an existing ruleset, use `PATCH` instead of `POST` with the ruleset ID in the URL
