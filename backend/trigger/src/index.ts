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
// Unit 28 — Engagement Optimization
export { processNonrespondentsTask } from "./tasks/process_nonrespondents.js";
export { evaluateOptRulesTask } from "./tasks/evaluate_opt_rules.js";
export { triggerFollowupsTask } from "./tasks/trigger_followups.js";
export { generateSegmentsTask } from "./tasks/generate_segments.js";
// Unit 31 — Gemini AI Infrastructure
export { analyzeTextTask } from "./tasks/analyze_text.js";
export { generateSummaryTask } from "./tasks/generate_summary.js";
export { classifyResponsesTask } from "./tasks/classify_responses.js";
export { processAITaskTask } from "./tasks/process_ai_task.js";
// Unit 32 — AI Analytics
export { summarizeResponsesTask } from "./tasks/summarize_responses.js";
export { analyzeSentimentTask } from "./tasks/analyze_sentiment.js";
export { generateInsightsTask } from "./tasks/generate_insights.js";
// Unit 33a — Simulation Mode Foundation
export { runSimulationTask } from "./tasks/run_simulation.js";
export { validateSimulationTask } from "./tasks/validate_simulation.js";
export { cleanupSimulationTask } from "./tasks/cleanup_simulation.js";
