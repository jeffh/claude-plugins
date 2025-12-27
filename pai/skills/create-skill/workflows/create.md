# Create Skill Workflow

Create a new Claude Code skill with proper structure.

## Procedure

### Step 1: Gather Skill Information

Ask the user:

1. **Skill name**: What should this skill be called?
   - Validate: kebab-case, max 64 chars
   - Example: "code-review", "database-query", "deploy-service"

2. **Location**: Where should this skill be created?
   - `~/.claude/skills/` - Personal (default)
   - `.claude/skills/` - Project (shared with team)
   - `pai/skills/` - PAI plugin
   - Custom path

3. **Description**: What does this skill do and when should it activate?
   - Must include capability statement
   - Must include trigger phrases (USE WHEN)
   - Example: "Reviews code for quality issues. USE WHEN user wants code reviewed OR needs PR feedback."

4. **Type**: What kind of skill is this?
   - Reference-only (principles, guides, standards)
   - Workflow-based (operational procedures)

5. **Workflows** (if workflow-based): What workflows are needed?
   - List workflow names (kebab-case)
   - Brief description of each

### Step 2: Create Directory Structure

```bash
mkdir -p [location]/[skill-name]/workflows  # if workflow-based
mkdir -p [location]/[skill-name]             # if reference-only
```

### Step 3: Generate SKILL.md

Create `[location]/[skill-name]/SKILL.md`:

```yaml
---
name: [skill-name]
description: [user-provided description with USE WHEN]
---

# [skill-name]

[Brief 1-2 sentence description]

## Workflow Routing  # if workflow-based

| Workflow | Trigger | File |
|----------|---------|------|
| [name] | [trigger] | [workflows/name.md](workflows/name.md) |

## Reference Documentation  # if has reference docs

- [doc-name.md](doc-name.md) - Description

## Examples

**Example 1: [Primary use case]**
\`\`\`
User: "[Sample user request]"
→ [What triggers]
→ [What happens]
→ [What user receives]
\`\`\`

**Example 2: [Secondary use case]**
\`\`\`
User: "[Sample user request]"
→ [What triggers]
→ [What happens]
→ [What user receives]
\`\`\`
```

### Step 4: Create Workflow Stubs (if workflow-based)

For each workflow, create `workflows/[name].md`:

```markdown
# [Workflow Name] Workflow

[Brief description of what this workflow does]

## Procedure

### Step 1: [First action]
[Instructions]

### Step 2: [Second action]
[Instructions]

## Completion

Report to user:
- What was accomplished
- Any follow-up actions needed
```

### Step 5: Validate

Run the validate workflow on the new skill:
- Check all structural requirements pass
- Check semantic requirements
- Report any issues

### Step 6: Report Success

Tell the user:
- Skill created at [full path]
- Restart Claude Code to load the skill
- Test with: "What skills are available?"

## Example Run

```
User: I want to create a skill for code review

Claude: I'll help you create a code-review skill. A few questions:

1. Where should this skill be created?
   - ~/.claude/skills/ (personal, default)
   - .claude/skills/ (project)

User: Personal is fine

Claude: What should the skill do and when should it activate?

User: Review PRs for code quality, security issues, and style

Claude: Should this be a reference skill (guidelines only) or have workflows?

User: Just guidelines

Claude: Creating skill...
✅ Created ~/.claude/skills/code-review/SKILL.md

Restart Claude Code, then test with: "What skills are available?"
```
