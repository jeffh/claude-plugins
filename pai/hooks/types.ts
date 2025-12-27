/**
 * PAI History Hooks - Shared TypeScript Types
 *
 * Types for Claude Code hook inputs and outputs, plus history entry formats.
 */

import { homedir } from "os";
import { join } from "path";

// Base directory for PAI history
export const PAI_HISTORY_DIR = join(homedir(), ".claude", "pai-history");

// Subdirectories
export const HISTORY_PATHS = {
  sessions: join(PAI_HISTORY_DIR, "sessions"),
  learnings: join(PAI_HISTORY_DIR, "learnings"),
  research: join(PAI_HISTORY_DIR, "research"),
  decisions: join(PAI_HISTORY_DIR, "decisions"),
  rawOutputs: join(PAI_HISTORY_DIR, "raw-outputs"),
} as const;

// ============================================================================
// Hook Event Types
// ============================================================================

export type HookEventName =
  | "PreToolUse"
  | "PostToolUse"
  | "UserPromptSubmit"
  | "SessionStart"
  | "SessionEnd"
  | "Stop"
  | "SubagentStop"
  | "PreCompact";

// ============================================================================
// Hook Input Types
// ============================================================================

/** Common fields present in all hook inputs */
export interface BaseHookInput {
  session_id: string;
  transcript_path: string;
  cwd: string;
  permission_mode?: string;
  hook_event_name: HookEventName;
}

/** SessionStart hook input */
export interface SessionStartInput extends BaseHookInput {
  hook_event_name: "SessionStart";
  source: "startup" | "resume" | "clear" | "compact";
}

/** SessionEnd hook input */
export interface SessionEndInput extends BaseHookInput {
  hook_event_name: "SessionEnd";
}

/** UserPromptSubmit hook input */
export interface UserPromptSubmitInput extends BaseHookInput {
  hook_event_name: "UserPromptSubmit";
  prompt: string;
}

/** PreToolUse hook input */
export interface PreToolUseInput extends BaseHookInput {
  hook_event_name: "PreToolUse";
  tool_name: string;
  tool_input: Record<string, unknown>;
}

/** PostToolUse hook input */
export interface PostToolUseInput extends BaseHookInput {
  hook_event_name: "PostToolUse";
  tool_name: string;
  tool_input: Record<string, unknown>;
  tool_use_id: string;
  tool_output?: string;
  tool_error?: string;
}

/** Stop hook input (when Claude finishes responding) */
export interface StopInput extends BaseHookInput {
  hook_event_name: "Stop";
  stop_hook_active?: boolean;
}

/** SubagentStop hook input (when a subagent finishes) */
export interface SubagentStopInput extends BaseHookInput {
  hook_event_name: "SubagentStop";
  stop_hook_active?: boolean;
}

/** PreCompact hook input (before context compaction) */
export interface PreCompactInput extends BaseHookInput {
  hook_event_name: "PreCompact";
  trigger: "auto" | "manual";
  custom_instructions?: string;
}

/** Union type of all hook inputs */
export type HookInput =
  | SessionStartInput
  | SessionEndInput
  | UserPromptSubmitInput
  | PreToolUseInput
  | PostToolUseInput
  | StopInput
  | SubagentStopInput
  | PreCompactInput;

// ============================================================================
// Hook Output Types
// ============================================================================

/** Hook-specific output for different event types */
export interface HookSpecificOutput {
  hookEventName: string;
  additionalContext?: string;
}

/** Standard hook output structure */
export interface HookOutput {
  hookSpecificOutput?: HookSpecificOutput;
  continue?: boolean;
  stopReason?: string;
  suppressOutput?: boolean;
  systemMessage?: string;
}

// ============================================================================
// History Entry Types
// ============================================================================

/** Session entry in sessions/ directory */
export interface SessionEntry {
  timestamp: string;
  event: "start" | "end";
  session_id: string;
  source?: string;
  cwd: string;
  transcript_path: string;
  duration_ms?: number;
}

/** Tool output entry in raw-outputs/ directory (legacy format) */
export interface ToolOutputEntry {
  timestamp: string;
  session_id: string;
  tool_name: string;
  tool_use_id: string;
  tool_input: Record<string, unknown>;
  tool_output?: string;
  tool_error?: string;
  cwd: string;
}

/** Unified event entry for raw-outputs/ directory */
export interface EventEntry {
  timestamp: string;
  event_type: HookEventName;
  session_id: string;
  cwd: string;
  transcript_path: string;
  // Event-specific fields
  // SessionStart
  source?: "startup" | "resume" | "clear" | "compact";
  // UserPromptSubmit
  prompt?: string;
  // PreToolUse / PostToolUse
  tool_name?: string;
  tool_input?: Record<string, unknown>;
  tool_use_id?: string;
  tool_output?: string;
  tool_error?: string;
  // Stop / SubagentStop
  stop_hook_active?: boolean;
  // PreCompact
  trigger?: "auto" | "manual";
  custom_instructions?: string;
}

/** Learning entry in learnings/ directory */
export interface LearningEntry {
  timestamp: string;
  session_id: string;
  category: string;
  content: string;
  source_tool?: string;
  source_file?: string;
}

/** Decision entry in decisions/ directory */
export interface DecisionEntry {
  timestamp: string;
  session_id: string;
  decision: string;
  context: string;
  alternatives?: string[];
  rationale?: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

/** Read stdin as a string (for Bun) */
export async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of Bun.stdin.stream()) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf-8");
}

/** Get today's date in YYYY-MM-DD format */
export function getDateString(): string {
  return new Date().toISOString().split("T")[0];
}

/** Get current ISO timestamp */
export function getTimestamp(): string {
  return new Date().toISOString();
}

/** Ensure directory exists */
export async function ensureDir(dir: string): Promise<void> {
  const { mkdir } = await import("fs/promises");
  await mkdir(dir, { recursive: true });
}

/** Append JSON line to file */
export async function appendJsonl(
  filepath: string,
  data: Record<string, unknown>,
): Promise<void> {
  const { appendFile } = await import("fs/promises");
  await appendFile(filepath, JSON.stringify(data) + "\n");
}
