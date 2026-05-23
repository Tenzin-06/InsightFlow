/**
 * InsightFlow — Trigger.dev task registry
 *
 * All tasks exported from this file are registered with Trigger.dev.
 * Add new task imports here as new background jobs are introduced.
 */

export { sendCampaignTask } from "./tasks/send_campaign.js";
export { sendTestEmailTask } from "./tasks/send_test_email.js";
export { processAudienceUploadTask } from "./tasks/process_audience_upload.js";
export { generateReportTask } from "./tasks/generate_report.js";
export { cleanupJobsTask } from "./tasks/cleanup_jobs.js";
export { executeScheduledCampaignTask } from "./tasks/execute_scheduled_campaign.js";
export { processRemindersTask } from "./tasks/process_reminders.js";
export { evaluateFollowupsTask } from "./tasks/evaluate_followups.js";
