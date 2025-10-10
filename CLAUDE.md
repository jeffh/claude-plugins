# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repository contains Claude Code plugins organized as a marketplace. The primary plugin is **humanlayer**, which provides specialized commands and agents for enhanced codebase research, planning, and implementation workflows.

## Repository Structure

```
.claude-plugin/
  marketplace.json     # Plugin marketplace configuration
humanlayer/
  agents/             # Specialized sub-agents for Task tool
  commands/           # Slash commands for Claude Code
```

## Plugin Architecture

### Marketplace Configuration

The `.claude-plugin/marketplace.json` file defines available plugins:
- **Name**: jeffh-claude-plugins
- **Primary plugin**: humanlayer (commands and agents from HumanLayer, without thought syncing)

### HumanLayer Plugin Components

#### Agents (in `humanlayer/agents/`)

Specialized sub-agents designed to be invoked via the Task tool. Each agent has a specific role:

- **codebase-analyzer**: Analyzes implementation details with file:line references. Documents HOW code works without suggesting improvements.
- **codebase-locator**: Finds WHERE code lives in the codebase. Returns file locations organized by purpose.
- **codebase-pattern-finder**: Finds similar implementations and usage examples. Shows existing patterns as reference.
- **thoughts-analyzer**: Deep dives on research topics within the thoughts/ directory.
- **thoughts-locator**: Discovers relevant documents in thoughts/ directory.
- **web-search-researcher**: Performs web research using WebSearch and WebFetch tools.

**Key principle**: All agents are documentarians, not critics. They describe what exists without suggesting improvements unless explicitly asked.

#### Commands (in `humanlayer/commands/`)

Slash commands that implement complete workflows:

- **/commit**: Creates git commits for session changes. Never adds Claude attribution or co-author info. Groups related changes logically.
- **/create_plan**: Interactive planning process that researches codebase, asks clarifying questions, and generates implementation plans in `thoughts/shared/plans/`.
- **/implement_plan**: Executes approved implementation plans phase-by-phase with automated and manual verification checkpoints.
- **/validate_plan**: Validates implementation against plan success criteria, running automated checks and identifying manual testing requirements.
- **/describe_pr**: Generates comprehensive PR descriptions using template from `thoughts/shared/pr_description.md`, runs verification steps, and updates PR.
- **/research_codebase**: Spawns parallel sub-agents to comprehensively research codebase questions and generates documentation in `thoughts/shared/research/`.

## Development Workflow Patterns

### Planning and Implementation Pattern

1. `/create_plan` - Research codebase, create detailed plan with phases
2. `/implement_plan` - Execute plan phase-by-phase
3. `/commit` - Create atomic commits
4. `/validate_plan` - Verify all success criteria
5. `/describe_pr` - Generate PR description and update

### Research Pattern

- Use `/research_codebase` to spawn parallel specialized agents
- Agents return findings with file:line references
- Research documented in `thoughts/shared/research/YYYY-MM-DD-description.md`

### Agent Invocation Pattern

When using the Task tool to spawn agents:
- Spawn multiple agents in parallel for efficiency
- Provide specific, detailed prompts
- Specify exact directories when known (e.g., `humanlayer-wui/` not generic "UI")
- Wait for all agents to complete before synthesizing
- Agents know their tools and search strategies - focus prompts on WHAT to find, not HOW

## Command and Agent Design Philosophy

### Documentation, Not Critique

All agents and commands follow a strict principle:
- Document what EXISTS, not what SHOULD BE
- Never suggest improvements unless explicitly asked
- Never perform root cause analysis unless requested
- Never critique implementation or architecture
- Focus on describing current state with precision

### Success Criteria Separation

Plans and validation separate verification into:
- **Automated Verification**: Commands that can be run (`make test`, linting, builds)
- **Manual Verification**: UI/UX, performance testing, edge cases requiring human judgment

Implementation pauses after automated checks for human to complete manual verification.

### File Reading Best Practices

- Always read mentioned files FULLY (never use limit/offset parameters)
- Read files in main context before spawning sub-tasks
- Sub-tasks should focus on searching, not reading specific known files

### Metadata and Documentation Standards

Research documents and plans include:
- YAML frontmatter with metadata (date, researcher, git_commit, branch, etc.)
- File naming: `YYYY-MM-DD-ENG-XXXX-description.md` (omit ticket number if none)
- GitHub permalinks when on main/master or pushed commits
- Specific file:line references throughout

## Key Integration Points

### Thoughts Directory Pattern

Commands assume a `thoughts/` directory structure:
- `thoughts/shared/plans/` - Implementation plans
- `thoughts/shared/research/` - Research documentation
- `thoughts/shared/prs/` - PR descriptions
- `thoughts/searchable/` - Hard links for searching (strip "searchable/" from paths when documenting)

### Git and GitHub

- Commands use `gh` CLI for GitHub operations
- Commit workflow never adds Claude attribution
- PR descriptions use templates from thoughts/ directory
- Plans track progress with checkboxes updated via Edit tool

### Task Tool Integration

The repository's agents are designed specifically for Claude Code's Task tool:
- Frontmatter defines name, description, tools, and model
- Each agent has focused responsibility
- Agents can be combined in parallel for comprehensive research
