# HumanLayer Plugin

**Category:** Development
**Version:** 2025-10-09
**Author:** HumanLayer

Commands and agents from HumanLayer, optimized for Claude Code workflows but with app-specific stuff removed. This plugin provides a complete development workflow system with specialized slash commands and research agents. See [original repository](https://github.com/humanlayer/humanlayer) for more details.

## Commands

The humanlayer plugin provides 6 slash commands that implement complete development workflows:

### `/commit`

Creates git commits for changes made during your session.

**Features:**
- Groups related changes logically
- Follows repository commit message conventions
- Never adds Claude attribution or co-author information
- Presents commit plan before execution

**Usage:**
```bash
/commit
```

---

### `/create_plan`

Interactive planning process that researches your codebase and generates detailed implementation plans.

**Features:**
- Spawns parallel research agents to understand existing code
- Asks clarifying questions based on actual codebase findings
- Generates plans with phases and success criteria (automated & manual)
- Saves to `thoughts/shared/plans/YYYY-MM-DD-description.md`

**Usage:**
```bash
# Interactive mode
/create_plan

# With ticket file
/create_plan thoughts/allison/tickets/eng_1234.md

# Deep analysis mode
/create_plan think deeply about thoughts/allison/tickets/eng_1234.md
```

---

### `/implement_plan`

Executes approved implementation plans phase-by-phase with verification checkpoints.

**Features:**
- Reads and understands complete plan context
- Implements each phase before moving to next
- Runs automated verification (tests, linting, builds)
- Pauses for manual verification before continuing
- Updates checkboxes in plan file as work progresses

**Usage:**
```bash
/implement_plan thoughts/shared/plans/2025-10-09-my-feature.md
```

---

### `/validate_plan`

Validates that an implementation plan was correctly executed by verifying all success criteria.

**Features:**
- Compares implementation against plan specifications
- Runs all automated verification commands
- Identifies what needs manual testing
- Generates comprehensive validation report
- Catches issues before they reach production

**Usage:**
```bash
/validate_plan thoughts/shared/plans/2025-10-09-my-feature.md
```

---

### `/describe_pr`

Generates comprehensive pull request descriptions using your repository's template.

**Features:**
- Reads PR description template from `thoughts/shared/pr_description.md`
- Analyzes full PR diff and commit history
- Runs verification commands when possible
- Saves to `thoughts/shared/prs/{number}_description.md`
- Updates PR description directly on GitHub

**Usage:**
```bash
/describe_pr
```

---

### `/research_codebase`

Conducts comprehensive codebase research by spawning parallel specialized agents.

**Features:**
- Spawns multiple agents in parallel for efficient research
- Documents findings with file:line references
- Generates research document with metadata
- Saves to `thoughts/shared/research/YYYY-MM-DD-description.md`
- Creates permanent GitHub permalinks when possible

**Usage:**
```bash
/research_codebase
# Then provide your research question when prompted
```

## Agents

The humanlayer plugin provides 6 specialized agents that can be invoked via Claude Code's Task tool. These agents are designed to be documentarians—they describe what exists without suggesting improvements unless explicitly asked.

### Codebase Agents

#### `codebase-analyzer`

Analyzes implementation details with precise file:line references.

**Use when you need to:**
- Understand HOW specific code works
- Trace data flow through components
- Document technical implementation details
- Get surgical precision on code behavior

**Tools:** Read, Grep, Glob, LS

---

#### `codebase-locator`

Finds WHERE code lives in the codebase.

**Use when you need to:**
- Locate files related to a feature
- Find test files, configs, or documentation
- Understand code organization
- Map out component locations

**Tools:** Grep, Glob, LS

---

#### `codebase-pattern-finder`

Finds similar implementations and usage examples.

**Use when you need to:**
- Find existing patterns to model after
- See how similar features are implemented
- Locate usage examples
- Discover testing patterns

**Tools:** Grep, Glob, Read, LS

---

### Thoughts Directory Agents

#### `thoughts-analyzer`

Deep dives on research topics within the thoughts/ directory.

**Use when you need to:**
- Extract key decisions from documents
- Find actionable insights from past research
- Understand historical context
- Filter high-value information from noise

**Tools:** Read, Grep, Glob, LS

---

#### `thoughts-locator`

Discovers relevant documents in the thoughts/ directory.

**Use when you need to:**
- Find existing tickets, plans, or research
- Locate historical decisions
- Discover related documentation
- Map out what thoughts exist on a topic

**Tools:** Grep, Glob, LS

---

### Web Research Agent

#### `web-search-researcher`

Performs comprehensive web research using search and fetch.

**Use when you need to:**
- Find modern information beyond training data
- Research APIs, libraries, or frameworks
- Discover best practices from web sources
- Gather technical documentation

**Tools:** WebSearch, WebFetch, TodoWrite, Read, Grep, Glob, LS

---

## Requirements

### Thoughts Directory Structure

Several commands expect a `thoughts/` directory with this structure:

```
thoughts/
├── shared/
│   ├── plans/              # Implementation plans
│   ├── research/           # Research documents
│   ├── prs/               # PR descriptions
│   └── pr_description.md  # PR template (for /describe_pr)
├── allison/               # Personal thoughts (user-specific)
│   └── tickets/
└── searchable/            # Hard links for searching
```
