#!/usr/bin/env bun
/**
 * PAI Event Capture Hook
 *
 * Captures all hook events for the PAI history system.
 * Logs to ~/.claude/pai-history/raw-outputs/
 *
 * Supported events:
 * - PostToolUse
 * - UserPromptSubmit
 * - SessionStart
 * - SessionEnd
 * - PreToolUse
 * - Stop
 * - SubagentStop
 * - PreCompact
 */

import { join } from "path";
import {
  type HookInput,
  type PostToolUseInput,
  type PreToolUseInput,
  type UserPromptSubmitInput,
  type SessionStartInput,
  type SessionEndInput,
  type StopInput,
  type SubagentStopInput,
  type PreCompactInput,
  type EventEntry,
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

function getToolCategory(toolName: string): string {
  if (RESEARCH_TOOLS.has(toolName)) return "research";
  if (DECISION_TOOLS.has(toolName)) return "decision";
  return "other";
}

async function captureEvent(input: HookInput): Promise<void> {
  // Skip certain tools for PreToolUse/PostToolUse
  if (
    (input.hook_event_name === "PreToolUse" ||
      input.hook_event_name === "PostToolUse") &&
    SKIP_TOOLS.has((input as PreToolUseInput | PostToolUseInput).tool_name)
  ) {
    return;
  }

  // Ensure directories exist
  await ensureDir(HISTORY_PATHS.rawOutputs);

  // Create base event entry
  const entry: EventEntry = {
    timestamp: getTimestamp(),
    event_type: input.hook_event_name,
    session_id: input.session_id,
    cwd: input.cwd,
    transcript_path: input.transcript_path,
  };

  // Add event-specific fields
  switch (input.hook_event_name) {
    case "SessionStart":
      entry.source = (input as SessionStartInput).source;
      break;

    case "SessionEnd":
      // No additional fields
      break;

    case "UserPromptSubmit":
      entry.prompt = (input as UserPromptSubmitInput).prompt;
      break;

    case "PreToolUse": {
      const preInput = input as PreToolUseInput;
      entry.tool_name = preInput.tool_name;
      entry.tool_input = preInput.tool_input;
      break;
    }

    case "PostToolUse": {
      const postInput = input as PostToolUseInput;
      entry.tool_name = postInput.tool_name;
      entry.tool_input = postInput.tool_input;
      entry.tool_use_id = postInput.tool_use_id;
      entry.tool_output = postInput.tool_output;
      entry.tool_error = postInput.tool_error;
      break;
    }

    case "Stop":
      entry.stop_hook_active = (input as StopInput).stop_hook_active;
      break;

    case "SubagentStop":
      entry.stop_hook_active = (input as SubagentStopInput).stop_hook_active;
      break;

    case "PreCompact": {
      const compactInput = input as PreCompactInput;
      entry.trigger = compactInput.trigger;
      entry.custom_instructions = compactInput.custom_instructions;
      break;
    }
  }

  // Write to date-based output file
  const filename = `${getDateString()}.jsonl`;
  const filepath = join(HISTORY_PATHS.rawOutputs, filename);
  await appendJsonl(filepath, entry);

  // Log event for debugging
  let logMessage = `[PAI] Captured ${input.hook_event_name}`;
  if (entry.tool_name) {
    logMessage += ` - ${entry.tool_name} (${getToolCategory(entry.tool_name)})`;
  }
  console.error(logMessage);
}

async function main(): Promise<void> {
  try {
    const inputText = await readStdin();
    const input = JSON.parse(inputText) as HookInput;

    await captureEvent(input);

    // Return empty output - we don't modify anything
    const output: HookOutput = {};
    console.log(JSON.stringify(output));
    process.exit(0);
  } catch (error) {
    console.error(
      `[PAI] Event capture error: ${error instanceof Error ? error.message : String(error)}`
    );
    // Exit 0 to not block - logging failures shouldn't stop operations
    process.exit(0);
  }
}

main();
