# Update Skill Workflow

Modify an existing Claude Code skill.

## Procedure

### Step 1: Identify Skill

Determine which skill to update:
- User may specify by name
- User may reference current context
- If ambiguous, list available skills and ask

Locate the skill:
1. Check `~/.claude/skills/[name]/`
2. Check `.claude/skills/[name]/`
3. Check plugin skill locations

### Step 2: Read Current State

Read and analyze:
- `SKILL.md` frontmatter and body
- Existing workflows (if any)
- Reference docs (if any)
- Current directory structure

Report current state to user.

### Step 3: Determine Changes

Ask what needs updating:

1. **Description/Triggers**
   - Current: "[current description]"
   - What should change?

2. **Workflows**
   - Add new workflow?
   - Remove existing workflow?
   - Modify workflow content?

3. **Reference Docs**
   - Add new reference doc?
   - Remove existing doc?
   - Modify doc content?

4. **Allowed Tools** (if applicable)
   - Current: [list or "none"]
   - What should change?

5. **Other**
   - Rename skill?
   - Move to different location?

### Step 4: Apply Changes

For each requested change:

**Description update:**
- Edit YAML frontmatter in SKILL.md
- Ensure USE WHEN clause is preserved/added

**Add workflow:**
- Create `workflows/[name].md` with stub template
- Add row to workflow routing table in SKILL.md

**Remove workflow:**
- Delete `workflows/[name].md`
- Remove row from routing table
- Check for broken links

**Add reference doc:**
- Create `[name].md` at skill root
- Add link in SKILL.md

**Remove reference doc:**
- Delete the file
- Remove link from SKILL.md

**Rename skill:**
- Rename directory to new name
- Update `name` field in frontmatter
- Update title header

**Move skill:**
- Move entire directory to new location
- Report new path

### Step 5: Validate

Run validate workflow on updated skill:
- Check all structural requirements
- Check semantic requirements
- Report any issues introduced

### Step 6: Report Changes

Summarize:
- What was changed
- New skill structure
- Any validation warnings
- Remind to restart Claude Code

## Example Run

```
User: Add a security-check workflow to my code-review skill

Claude: Found code-review skill at ~/.claude/skills/code-review/

Current structure:
- SKILL.md (reference-only, no workflows)

Adding security-check workflow:
1. Creating workflows/ directory
2. Creating workflows/security-check.md
3. Adding workflow routing table to SKILL.md

✅ Changes applied

New structure:
~/.claude/skills/code-review/
├── SKILL.md (updated)
└── workflows/
    └── security-check.md

Restart Claude Code to reload the skill.
```
