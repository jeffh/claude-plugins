---
description: Generate comprehensive markdown documentation for all plugins in the marketplace
---

# Write Plugin Documentation

You are tasked with generating comprehensive documentation for all plugins in this marketplace.

## Process:

1. **Read the marketplace configuration:**
   - Read `.claude-plugin/marketplace.json` to get the list of all plugins
   - Extract plugin metadata: name, description, version, author, category

2. **For each plugin, gather information:**
   - Read all command files from `{plugin}/commands/*.md`
   - Read all agent files from `{plugin}/agents/*.md`
   - Extract frontmatter metadata where available (description, model, etc.)
   - Extract command/agent names, descriptions, and key features from content

3. **Generate documentation file for each plugin:**
   - Create `docs/{plugin-name}.md` for each plugin
   - Use the existing `docs/humanlayer.md` as a reference format
   - Include:
     - Plugin overview with metadata (category, version, author)
     - Commands section with usage examples
     - Agents section (if applicable) with use cases
     - Requirements section (if applicable)
   - Format:
     ```markdown
     # {Plugin Name} Plugin

     **Category:** {category}
     **Version:** {version}
     **Author:** {author}

     {description}

     ## Commands

     ### `/{command-name}`

     {Description from frontmatter or content}

     **Features:**
     - {List key features extracted from content}

     **Usage:**
     ```bash
     /{command-name} [args]
     ```

     ---

     ## Agents

     ### `{agent-name}`

     {Description}

     **Use when you need to:**
     - {Use cases}

     **Tools:** {List from frontmatter if available}

     ---

     ## Requirements

     {Any special requirements or setup needed}
     ```

4. **Update README.md:**
   - Read the current `README.md`
   - Update the "Available Plugins" section to include ALL plugins
   - For each plugin:
     - Add a subsection with plugin name
     - Add a link to its documentation: `**[Full Documentation →](docs/{plugin-name}.md)**`
     - Add a quick overview listing main commands and agents
   - Ensure formatting is consistent
   - Preserve existing content structure

5. **Present results:**
   - Show the user which documentation files were created/updated
   - Display a summary of commands and agents documented per plugin
   - Confirm README.md was updated

## Important Notes:

- Extract actual functionality from command/agent content, don't make up features
- Preserve any special instructions or requirements from command files
- Be concise but comprehensive in descriptions
- Use consistent formatting across all documentation files
- If a plugin has no agents, omit the Agents section
- If a plugin has no special requirements, omit the Requirements section
- Commands with frontmatter descriptions should use those first
- Look at command content to extract key features and usage patterns
