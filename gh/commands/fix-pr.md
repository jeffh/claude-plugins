---
description: Fix PR issues based on review comments, status checks, and CI failures
---

# Fix PR

You are tasked with fixing issues on a Pull Request based on review feedback, status checks, and CI failures.

## Input

The user will provide either:
- A PR number (e.g., `123`)
- A PR URL (e.g., `https://github.com/owner/repo/pull/123`)

If just a number is provided, assume it's for the current repository.

## Process

### 1. Gather PR Information

First, collect all relevant information about the PR:

```bash
# Get PR details (number, title, state, base branch)
gh pr view {PR} --json number,title,state,baseRefName,headRefName,body

# Get review comments (code review feedback)
gh api repos/{owner}/{repo}/pulls/{PR}/comments --jq '.[] | {path: .path, line: .line, body: .body, user: .user.login, created_at: .created_at}'

# Get PR review summaries (approved, changes requested, etc.)
gh api repos/{owner}/{repo}/pulls/{PR}/reviews --jq '.[] | {state: .state, body: .body, user: .user.login}'

# Get issue comments (general discussion on the PR)
gh api repos/{owner}/{repo}/issues/{PR}/comments --jq '.[] | {body: .body, user: .user.login, created_at: .created_at}'

# Get status checks
gh pr checks {PR} --json name,state,conclusion,description

# Get workflow run details for failed checks
gh run list --branch {head_branch} --limit 5 --json databaseId,name,conclusion,status
```

For failed workflow runs, get the logs:
```bash
gh run view {run_id} --log-failed
```

### 2. Analyze Feedback

Categorize all gathered feedback into:

1. **CI Failures**: Failed status checks, workflow errors, test failures
2. **Review Comments**: Code review feedback with specific file/line references
3. **Change Requests**: Reviews marked as "changes requested" with specific asks
4. **General Comments**: Discussion comments that may contain actionable feedback
5. **Unclear Feedback**: Comments that don't have a clear action item

### 3. Create Task List

Use the TodoWrite tool to create a task list of all issues to fix. Each task should be specific and actionable:

- For CI failures: "Fix [test name] in [file]" or "Resolve [error type] in CI"
- For review comments: "Address review comment on [file:line] - [summary]"
- For change requests: "Implement requested change: [description]"

### 4. Handle Unclear Feedback

For any feedback that doesn't have a clear recommendation or action:

1. Present the unclear feedback to the user using AskUserQuestion
2. Ask what action they'd like to take:
   - "Implement a specific fix" (let user describe)
   - "Reply to comment asking for clarification"
   - "Skip this feedback"

Add any user-specified actions to the task list.

### 5. Checkout the PR Branch

Before making changes, ensure you're on the PR branch:

```bash
gh pr checkout {PR}
```

### 6. Fix Each Issue

Work through the task list systematically:

1. Mark the current task as `in_progress`
2. Make the necessary code changes
3. Verify the fix (run tests if applicable)
4. Mark the task as `completed`
5. Move to the next task

### 7. Verify Fixes

After completing all tasks, run verification:

```bash
# Run any project-specific tests/checks
# This depends on the project - check for Makefile, package.json scripts, etc.

# For common patterns:
make test        # if Makefile exists
npm test         # if package.json exists
cargo test       # if Cargo.toml exists
pytest           # if Python project
go test ./...    # if Go project
```

### 8. Summarize Changes

After all fixes are complete:

1. Show a summary of what was fixed
2. Show the git diff of changes made
3. Ask the user if they want to:
   - Commit the changes (suggest using /commit command)
   - Push to update the PR
   - Make additional modifications

## Important Notes

- **Do not push automatically** - always ask the user before pushing changes
- **Preserve existing code style** - match the formatting and conventions of the codebase
- **Run tests locally** - verify fixes work before considering them complete
- **One fix at a time** - complete each task fully before moving to the next
- **Ask when uncertain** - if a fix approach is unclear, ask the user rather than guessing

## Example Workflow

```
User: /fix-pr 123