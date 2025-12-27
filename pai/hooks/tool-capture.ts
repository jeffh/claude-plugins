#!/usr/bin/env bun
/**
 * PAI Tool Capture Hook
 *
 * Captures all tool outputs for the PAI history system.
 * Logs to ~/.claude/pai-history/raw-outputs/
 *
 * Event: PostToolUse
 */

import { join } from "path";
import {
  type PostToolUseInput,
  type ToolOutputEntry,
  type HookOutput,
  HISTORY_PATHS,
  readStdin,
  getDateString,
  getTimestamp,
  ensureDir,
  appendJsonl,
} from "./types";

// Tools to skip capturing (high volume, low value)
const SKIP_TOOLS = new Set([
  "TodoRead", // Internal state
]);

// Tools that indicate research activity
const RESEARCH_TOOLS = new Set([
  "WebSearch",
  "WebFetch",
  "Grep",
  "Glob",
  "Read",
]);

// Tools that indicate decisions/changes
const DECISION_TOOLS = new Set(["Edit", "Write", "Bash"]);

async function captureToolOutput(input: PostToolUseInput): Promise<void> {
  // Skip certain tools
  if (SKIP_TOOLS.has(input.tool_name)) {
    return;
  }

  // Ensure directories exist
  await ensureDir(HISTORY_PATHS.rawOutputs);

  // Create tool output entry
  const entry: ToolOutputEntry = {
    timestamp: getTimestamp(),
    session_id: input.session_id,
    tool_name: input.tool_name,
    tool_use_id: input.tool_use_id,
    tool_input: input.tool_input,
    tool_output: input.tool_output,
    tool_error: input.tool_error,
    cwd: input.cwd,
  };

  // Write to date-based output file
  const filename = `${getDateString()}.jsonl`;
  const filepath = join(HISTORY_PATHS.rawOutputs, filename);
  await appendJsonl(filepath, entry);

  // Log tool category for debugging
  const category = RESEARCH_TOOLS.has(input.tool_name)
    ? "research"
    : DECISION_TOOLS.has(input.tool_name)
      ? "decision"
      : "other";
  console.error(`[PAI] Captured ${input.tool_name} (${category})`);
}

async function main(): Promise<void> {
  try {
    const inputText = await readStdin();
    const input = JSON.parse(inputText) as PostToolUseInput;

    if (input.hook_event_name === "PostToolUse") {
      await captureToolOutput(input);
    }

    // Return empty output - we don't modify anything
    const output: HookOutput = {};
    console.log(JSON.stringify(output));
    process.exit(0);
  } catch (error) {
    console.error(
      `[PAI] Tool capture error: ${error instanceof Error ? error.message : String(error)}`
    );
    // Exit 0 to not block - logging failures shouldn't stop operations
    process.exit(0);
  }
}

main();
