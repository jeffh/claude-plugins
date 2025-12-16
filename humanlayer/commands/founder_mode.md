---
description: Create Linear ticket and PR for experimental features after implementation
---

you're working on an experimental feature that didn't get the proper ticketing and pr stuff set up.

assuming you just made a commit, here are the next steps:


1. Get the commit identifier you just made (if you didn't make one, read `.claude/commands/commit.md` and make one):
   - For git users: Get the SHA with `git rev-parse HEAD`
   - For jj users: Get the change ID with `jj log -r @ --no-graph -T 'change_id.short()'`

2. Read `.claude/commands/linear.md` - think deeply about what you just implemented, then create a linear ticket about what you just did, and put it in 'in dev' state - it should have ### headers for "problem to solve" and "proposed solution"

3. Fetch the ticket to get the recommended branch name

4. Create a new branch from main with your changes:

   For git users:
   ```bash
   git checkout main
   git checkout -b 'BRANCHNAME'
   git cherry-pick 'COMMITHASH'
   git push -u origin 'BRANCHNAME'
   ```

   For jj users:
   ```bash
   jj new main -m "description from ticket"
   jj squash --from 'CHANGEID'  # Squash the experimental change into new change
   jj bookmark create BRANCHNAME
   jj git push --bookmark BRANCHNAME
   ```

5. Create PR: `gh pr create --fill`

6. Read '.claude/commands/describe_pr.md' and follow the instructions
