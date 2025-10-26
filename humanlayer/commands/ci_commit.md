---
description: Create commits for session changes with clear, atomic messages (supports git and jj)
---

# Commit Changes

You are tasked with creating commits for the changes made during this session. This command supports both git and Jujutsu (jj) version control systems.

## Process:

1. **Think about what changed:**
   - Review the conversation history and understand what was accomplished
   - Check current changes:
     - For git users: `git status` and `git diff`
     - For jj users: `jj status` and `jj diff`
   - Consider whether changes should be one commit or multiple logical commits

2. **Plan your commit(s):**
   - Identify which files belong together
   - Draft clear, descriptive commit messages
   - Use imperative mood in commit messages
   - Focus on why the changes were made, not just what

3. **Execute upon confirmation:**
   - Never commit the `thoughts/` directory or anything inside it!
   - Never commit dummy files, test scripts, or other files which you created or which appear to have been created but which were not part of your changes or directly caused by them (e.g. generated code)
   - For git users:
     - Use `git add` with specific files (never use `-A` or `.`)
     - Create commits with your planned messages: `git commit -m "message"`
   - For jj users:
     - Changes are automatically tracked
     - Create changes with descriptions: `jj describe -m "message"`

## Remember:
- You have the full context of what was done in this session
- Group related changes together
- Keep commits focused and atomic when possible
- The user trusts your judgment - they asked you to commit
- **IMPORTANT**: - never stop and ask for feedback from the user. 