# Skill Schema Specification

Authoritative reference for Claude Code skill structure and conventions.

## Directory Structure

```
skill-name/                         # kebab-case directory
├── SKILL.md                        # Required: Main skill file (UPPERCASE)
├── reference-doc.md                # Optional: Reference docs (kebab-case)
├── tools/                          # Optional: CLI tools directory
│   ├── tool-name.ts                # TypeScript CLI tool
│   └── tool-name.help.md           # Tool documentation
└── workflows/                      # Optional: Workflow procedures
    ├── create.md                   # Workflow file (kebab-case)
    └── update.md                   # Workflow file (kebab-case)
```

## YAML Frontmatter

### Required Fields

```yaml
---
name: skill-name
description: What this skill does. USE WHEN [trigger phrases with OR].
---
```

| Field | Requirements |
|-------|-------------|
| `name` | Lowercase, kebab-case, max 64 chars. Must match directory name. |
| `description` | Single line, max 1024 chars. Include "USE WHEN" with trigger phrases. |

### Optional Fields

| Field | Description |
|-------|-------------|
| `allowed-tools` | Comma-separated list of tools Claude can use without permission |
| `model` | Model to use (e.g., `claude-sonnet-4-20250514`) |

### Description Format

The description field has three parts:
1. **What it does**: Brief capability statement
2. **USE WHEN clause**: Trigger phrases separated by OR
3. **Additional context**: Optional extra info

Example:
```yaml
description: Create and manage skills. USE WHEN user wants to create a skill OR modify a skill OR validate skill structure. Handles all skill lifecycle operations.
```

## Markdown Body Structure

### Required Sections

1. **Title Header** - `# skill-name` matching the YAML name
2. **Brief Description** - 1-2 sentences explaining purpose
3. **Examples Section** - 2-3 concrete usage patterns

### Optional Sections

- **Workflow Routing** - Table with workflow, trigger, file columns
- **Reference Documentation** - Links to supporting docs
- **Domain-specific sections** - Principles, guidelines, etc.

## Naming Conventions

| Component | Format | Example |
|-----------|--------|---------|
| Skill directory | kebab-case | `create-skill` |
| YAML `name` field | kebab-case | `create-skill` |
| Main skill file | UPPERCASE | `SKILL.md` |
| Workflow files | kebab-case | `create.md` |
| Reference docs | kebab-case | `skill-schema.md` |
| Tool files | kebab-case | `validate-skill.ts` |

## Skill Locations

| Type | Path | Scope |
|------|------|-------|
| Enterprise | Managed settings | All organization users |
| Personal | `~/.claude/skills/` | Current user, all projects |
| Project | `.claude/skills/` | Anyone in repository |
| Plugin | `skills/` in plugin | Anyone with plugin |

Priority: Enterprise > Personal > Project > Plugin

## Workflows vs Reference Docs

**Workflows** (`workflows/` directory):
- Operational procedures you "run"
- Step-by-step execution instructions
- Create, update, delete, deploy actions

**Reference Docs** (skill root):
- Information you "read" or "reference"
- Guides, specs, schemas
- API documentation

## Examples Section Format

```markdown
## Examples

**Example 1: [Use case name]**
\`\`\`
User: "[Actual user request]"
→ [What triggers]
→ [What happens]
→ [What user receives]
\`\`\`
```

Provide 2-3 examples showing:
- Different trigger phrases
- Various use cases
- Expected outcomes

## Context Management

Keep SKILL.md under 500 lines. Use progressive disclosure:
- Essential info in SKILL.md
- Detailed reference in separate files
- Claude reads additional files only when needed
