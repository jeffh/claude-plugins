# Claude Code Plugins

A collection of powerful plugins for [Claude Code](https://claude.ai/code) that enhance your development workflow with specialized commands and agents for codebase research, planning, and implementation.

## Overview

This repository provides a plugin marketplace for Claude Code. Currently it contains the **humanlayer** plugin with 6 slash commands and 6 specialized agents designed to help you research codebases, create detailed implementation plans, and execute development workflows more efficiently.

## Installation

### Add This Marketplace to Claude Code

You can install plugins from this marketplace using one of these methods:

#### From GitHub (Recommended)

```bash
/plugin marketplace add jeffh/claude-plugins
```

#### From Local Directory

If you've cloned this repository locally:

```bash
/plugin marketplace add /path/to/claude-plugins
```

### Install the humanlayer Plugin

After adding the marketplace, install the plugin:

```bash
# Interactive installation (browse all available plugins)
/plugin

# Direct installation
/plugin install humanlayer@jeffh-claude-plugins
```

## Available Plugins

### humanlayer

Commands and agents from HumanLayer, optimized for Claude Code workflows. Provides 6 slash commands for complete development workflows and 6 specialized research agents.

**[Full Documentation →](docs/humanlayer.md)**

**Quick Overview:**
- **Commands:** `/commit`, `/create_plan`, `/implement_plan`, `/validate_plan`, `/describe_pr`, `/research_codebase`
- **Agents:** `codebase-analyzer`, `codebase-locator`, `codebase-pattern-finder`, `thoughts-analyzer`, `thoughts-locator`, `web-search-researcher`

## Workflow Examples

### Complete Feature Development

```bash
# 1. Research and plan
/create_plan

# 2. Implement the plan
/implement_plan thoughts/shared/plans/2025-10-09-my-feature.md

# 3. Create commits
/commit

# 4. Validate implementation
/validate_plan thoughts/shared/plans/2025-10-09-my-feature.md

# 5. Generate PR description
/describe_pr
```

### Codebase Investigation

```bash
# Comprehensive research
/research_codebase
# Provide: "How does authentication work in this codebase?"

# Or spawn agents directly via Task tool for specific questions
```

## Requirements

Some commands expect a `thoughts/` directory structure. See individual plugin documentation for details.
