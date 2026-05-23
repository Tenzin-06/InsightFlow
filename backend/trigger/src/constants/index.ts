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
} as const;

export type TaskId = (typeof TASK_IDS)[keyof typeof TASK_IDS];
