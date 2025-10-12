#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const yamlFront = require('yaml-front-matter');
const { glob } = require('glob');

// Known Claude Code tools (for validation)
const KNOWN_TOOLS = [
  'Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep',
  'Task', 'TodoWrite', 'WebFetch', 'WebSearch',
  'NotebookEdit', 'BashOutput', 'KillBash', 'LS',
  'SlashCommand', 'ExitPlanMode'
];

// Valid model identifiers
const VALID_MODELS = ['sonnet', 'opus', 'haiku', 'inherit'];

// Valid model patterns (full identifiers)
const MODEL_PATTERNS = [
  /^claude-3-5-sonnet-\d{8}$/,
  /^claude-3-opus-\d{8}$/,
  /^claude-3-haiku-\d{8}$/,
  /^claude-3-5-haiku-\d{8}$/,
  /^sonnet$/,
  /^opus$/,
  /^haiku$/,
  /^inherit$/
];

class ValidationError extends Error {
  constructor(message, file = null) {
    super(message);
    this.file = file;
    this.name = 'ValidationError';
  }
}

class Validator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  error(message, file = null) {
    this.errors.push({ message, file });
  }

  warn(message, file = null) {
    this.warnings.push({ message, file });
  }

  hasErrors() {
    return this.errors.length > 0;
  }

  printResults() {
    if (this.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.warnings.forEach(({ message, file }) => {
        console.log(`   ${file ? `[${file}] ` : ''}${message}`);
      });
    }

    if (this.errors.length > 0) {
      console.log('\n❌ Validation Errors:');
      this.errors.forEach(({ message, file }) => {
        console.log(`   ${file ? `[${file}] ` : ''}${message}`);
      });
      return false;
    }

    console.log('\n✅ All validations passed!');
    return true;
  }
}

async function validateMarketplace(validator) {
  const marketplacePath = path.join(process.cwd(), '.claude-plugin/marketplace.json');

  console.log('Validating marketplace.json...');

  // Check if file exists
  if (!fs.existsSync(marketplacePath)) {
    validator.error('marketplace.json not found at .claude-plugin/marketplace.json');
    return null;
  }

  // Parse JSON
  let marketplace;
  try {
    const content = fs.readFileSync(marketplacePath, 'utf8');
    marketplace = JSON.parse(content);
  } catch (error) {
    validator.error(`Invalid JSON: ${error.message}`, 'marketplace.json');
    return null;
  }

  // Validate against schema
  const schemaPath = path.join(process.cwd(), 'schemas/marketplace.schema.json');
  if (fs.existsSync(schemaPath)) {
    try {
      const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
      const ajv = new Ajv({ allErrors: true, strict: false });
      addFormats(ajv);
      const validate = ajv.compile(schema);
      const valid = validate(marketplace);

      if (!valid) {
        validate.errors.forEach(error => {
          const path = error.instancePath || 'root';
          validator.error(
            `Schema validation failed at ${path}: ${error.message}`,
            'marketplace.json'
          );
        });
      }
    } catch (error) {
      validator.warn(`Could not validate schema: ${error.message}`, 'marketplace.json');
    }
  }

  // Validate plugin sources exist (for local paths)
  if (marketplace.plugins) {
    marketplace.plugins.forEach(plugin => {
      if (plugin.source && plugin.source.startsWith('./')) {
        const pluginPath = path.join(process.cwd(), plugin.source);
        if (!fs.existsSync(pluginPath)) {
          validator.error(
            `Plugin source directory does not exist: ${plugin.source}`,
            'marketplace.json'
          );
        }
      }
    });
  }

  return marketplace;
}

function validateAgentFile(filePath, validator) {
  const relativePath = path.relative(process.cwd(), filePath);

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Parse YAML frontmatter
    let frontmatter;
    try {
      frontmatter = yamlFront.loadFront(content);
    } catch (error) {
      validator.error(`Invalid YAML frontmatter: ${error.message}`, relativePath);
      return;
    }

    // Check required fields
    if (!frontmatter.name) {
      validator.error('Missing required field: name', relativePath);
    } else {
      // Validate name format (lowercase letters and hyphens only)
      if (!/^[a-z][a-z0-9-]*$/.test(frontmatter.name)) {
        validator.error(
          `Invalid agent name format: "${frontmatter.name}". Must start with lowercase letter and contain only lowercase letters, numbers, and hyphens.`,
          relativePath
        );
      }
    }

    if (!frontmatter.description) {
      validator.error('Missing required field: description', relativePath);
    }

    // Validate model (if specified)
    if (frontmatter.model) {
      const isValid = MODEL_PATTERNS.some(pattern => pattern.test(frontmatter.model));
      if (!isValid) {
        validator.error(
          `Invalid model: "${frontmatter.model}". Must be one of: ${VALID_MODELS.join(', ')} or a valid Claude model identifier`,
          relativePath
        );
      }
    }

    // Validate tools (if specified)
    if (frontmatter.tools) {
      const toolsList = frontmatter.tools
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      toolsList.forEach(tool => {
        // Remove any parameters or patterns (e.g., "Bash(*)" -> "Bash")
        const toolName = tool.replace(/\(.*\)$/, '');
        if (!KNOWN_TOOLS.includes(toolName) && toolName !== '*') {
          validator.warn(
            `Unknown tool: "${tool}". Known tools: ${KNOWN_TOOLS.join(', ')}`,
            relativePath
          );
        }
      });
    }

    // Check that there's content beyond frontmatter
    if (!frontmatter.__content || frontmatter.__content.trim().length === 0) {
      validator.warn('Agent file has no content beyond frontmatter', relativePath);
    }

  } catch (error) {
    validator.error(`Error reading file: ${error.message}`, relativePath);
  }
}

function validateCommandFile(filePath, validator) {
  const relativePath = path.relative(process.cwd(), filePath);

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Parse YAML frontmatter (if present)
    let frontmatter;
    try {
      frontmatter = yamlFront.loadFront(content);
    } catch (error) {
      validator.error(`Invalid YAML frontmatter: ${error.message}`, relativePath);
      return;
    }

    // Validate model (if specified)
    if (frontmatter.model) {
      const isValid = MODEL_PATTERNS.some(pattern => pattern.test(frontmatter.model));
      if (!isValid) {
        validator.warn(
          `Potentially invalid model: "${frontmatter.model}". Expected format: claude-3-5-sonnet-YYYYMMDD or shorthand like "sonnet"`,
          relativePath
        );
      }
    }

    // Validate allowed-tools format (if specified)
    if (frontmatter['allowed-tools']) {
      const tools = frontmatter['allowed-tools'];
      if (typeof tools === 'string' && tools.trim().length > 0) {
        // Basic validation - just check it's not empty
        // The actual format is complex (e.g., "Bash(git add:*)")
        // so we just warn if it looks suspicious
        if (!tools.includes('(') && !KNOWN_TOOLS.includes(tools)) {
          validator.warn(
            `allowed-tools value may be incorrect: "${tools}"`,
            relativePath
          );
        }
      }
    }

    // Validate disable-model-invocation (if specified)
    if (frontmatter['disable-model-invocation'] !== undefined) {
      if (typeof frontmatter['disable-model-invocation'] !== 'boolean') {
        validator.error(
          'disable-model-invocation must be a boolean',
          relativePath
        );
      }
    }

    // Check that there's content beyond frontmatter
    if (!frontmatter.__content || frontmatter.__content.trim().length === 0) {
      validator.warn('Command file has no content beyond frontmatter', relativePath);
    }

  } catch (error) {
    validator.error(`Error reading file: ${error.message}`, relativePath);
  }
}

async function validatePlugin(pluginPath, pluginName, validator) {
  console.log(`\nValidating plugin: ${pluginName}`);

  if (!fs.existsSync(pluginPath)) {
    validator.error(`Plugin directory does not exist: ${pluginPath}`, pluginName);
    return;
  }

  // Find and validate agents
  const agentsDir = path.join(pluginPath, 'agents');
  if (fs.existsSync(agentsDir)) {
    const agentFiles = await glob('*.md', { cwd: agentsDir, absolute: true });
    console.log(`  Found ${agentFiles.length} agent file(s)`);

    agentFiles.forEach(agentFile => {
      validateAgentFile(agentFile, validator);
    });
  } else {
    console.log('  No agents directory found');
  }

  // Find and validate commands
  const commandsDir = path.join(pluginPath, 'commands');
  if (fs.existsSync(commandsDir)) {
    const commandFiles = await glob('*.md', { cwd: commandsDir, absolute: true });
    console.log(`  Found ${commandFiles.length} command file(s)`);

    commandFiles.forEach(commandFile => {
      validateCommandFile(commandFile, validator);
    });
  } else {
    console.log('  No commands directory found');
  }
}

async function main() {
  console.log('🔍 Claude Code Plugin Validator\n');
  console.log('='.repeat(50));

  const validator = new Validator();

  // Validate marketplace.json
  const marketplace = await validateMarketplace(validator);

  // Validate each plugin
  if (marketplace && marketplace.plugins) {
    for (const plugin of marketplace.plugins) {
      if (plugin.source && plugin.source.startsWith('./')) {
        const pluginPath = path.join(process.cwd(), plugin.source);
        await validatePlugin(pluginPath, plugin.name, validator);
      }
    }
  }

  // Print results
  console.log('\n' + '='.repeat(50));
  const success = validator.printResults();

  process.exit(success ? 0 : 1);
}

// Run validator
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
