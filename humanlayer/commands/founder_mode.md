---
description: Create Linear ticket and PR for experimental features after implementation
---

you're working on an experimental feature that didn't get the proper ticketing and pr stuff set up.

assuming you just made a commit/change, here are the next steps:

1. get the commit hash/change id you just made (if you didn't make one, read `.claude/commands/commit.md` and make one)

2. read `.claude/commands/linear.md` - think deeply about what you just implemented, then create a linear ticket about what you just did, and put it in 'in dev' state - it should have ### headers for "problem to solve" and "proposed solution"

3. fetch the ticket to get the recommended branch name

4. Create a branch/bookmark and move your changes:
   - For git users:
     ```bash
     git checkout main
     git checkout -b 'BRANCHNAME'
     git cherry-pick 'COMMITHASH'
     git push -u origin 'BRANCHNAME'
     ```
   - For jj users:
     ```bash
     jj bookmark create 'BRANCHNAME'
     jj git push -b 'BRANCHNAME'
     ```

5. gh pr create --fill

6. read '.claude/commands/describe_pr.md' and follow the instructions
