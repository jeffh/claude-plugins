---
name: create-skill
description: Create, update, validate, and canonicalize Claude Code skills. USE WHEN user wants to create a new skill OR modify an existing skill OR validate skill structure OR fix skill format OR migrate legacy skills.
---

# create-skill

Manage Claude Code skills with consistent structure and validation.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| create | User wants to create a new skill | [workflows/create.md](workflows/create.md) |
| update | User wants to modify an existing skill | [workflows/update.md](workflows/update.md) |
| validate | User wants to verify skill correctness | [workflows/validate.md](workflows/validate.md) |
| canonicalize | User wants to fix skill structure or migrate legacy format | [workflows/canonicalize.md](workflows/canonicalize.md) |

## Reference Documentation

- [skill-schema.md](skill-schema.md) - Canonical skill structure specification
- [validation-rules.md](validation-rules.md) - Complete validation checklist

## Examples

**Example 1: Create a new skill**
```
User: "I want to create a skill for code review"
→ Invokes create workflow
→ Asks for skill name, location, description
→ Generates skill directory with SKILL.md and structure
→ Runs validation
```

**Example 2: Validate an existing skill**
```
User: "Check if my prompting skill is valid"
→ Invokes validate workflow
→ Checks structural, semantic, and quality rules
→ Reports ✅ passed, ⚠️ warnings, ❌ errors
→ Provides specific fix suggestions
```

**Example 3: Fix a broken skill**
```
User: "My skill has wrong file names and missing sections"
→ Invokes canonicalize workflow
→ Renames files to kebab-case
→ Adds missing Examples section
→ Normalizes YAML frontmatter
→ Reports all changes made
```
