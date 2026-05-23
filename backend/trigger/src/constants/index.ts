/**
 * Job status constants — mirrors Django BackgroundJob.STATUS_* values.
 */
export const JOB_STATUS = {
  QUEUED: "queued",
  RUNNING: "running",
  COMPLETED: "completed",
  FAILED: "failed",
  RETRYING: "retrying",
} as const;

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];

/**
 * Task IDs — must match the `id` field in each task() definition.
 */
export const TASK_IDS = {
  SEND_CAMPAIGN: "send-campaign",
  SEND_TEST_EMAIL: "send-test-email",
  PROCESS_AUDIENCE_UPLOAD: "process-audience-upload",
  GENERATE_REPORT: "generate-report",
  CLEANUP_JOBS: "cleanup-jobs",
  EXECUTE_SCHEDULED_CAMPAIGN: "execute-scheduled-campaign",
  PROCESS_REMINDERS: "process-reminders",
  EVALUATE_FOLLOWUPS: "evaluate-followups",
  // Unit 28 — Engagement Optimization
  PROCESS_NONRESPONDENTS: "process-nonrespondents",
  EVALUATE_OPT_RULES: "evaluate-opt-rules",
  TRIGGER_FOLLOWUPS: "trigger-followups",
  GENERATE_SEGMENTS: "generate-segments",
  // Unit 31 — Gemini AI Infrastructure
  ANALYZE_TEXT: "analyze-text",
  GENERATE_SUMMARY: "generate-summary",
  CLASSIFY_RESPONSES: "classify-responses",
  PROCESS_AI_TASK: "process-ai-task",
  // Unit 33a - Simulation Mode Foundation
  RUN_SIMULATION: "run-simulation",
  VALIDATE_SIMULATION: "validate-simulation",
  CLEANUP_SIMULATION: "cleanup-simulation",
} as const;

export type TaskId = (typeof TASK_IDS)[keyof typeof TASK_IDS];
