# InsightFlow — Project Overview

## 📌 Overview

InsightFlow is an AI-powered survey intelligence and distribution platform designed to enhance how surveys are shared, completed, and analyzed. Instead of replacing tools like Google Forms, it works as an intelligence layer on top of existing survey systems to improve response rates, targeting, engagement, and insights. The platform helps researchers, students, and government officers distribute surveys more effectively, track respondent behavior, and generate meaningful analysis using AI, while also offering controlled synthetic response simulation for testing and validation purposes.

---

## 🎯 Project Goals

1. Improve survey response rates through better distribution and automated engagement.
2. Enable efficient multi-channel survey sharing (email + link + QR).
3. Provide real-time tracking of survey performance (opens, clicks, completions).
4. Enhance survey insights using AI-powered analysis (summaries, sentiment, quality scoring).
5. Introduce a controlled simulation mode for testing survey design and hypotheses.
6. Reduce manual effort in survey follow-ups and reminders.
7. Make survey analytics accessible and understandable for non-technical users.

---

## 🔄 Core User Flow (End-to-End)

1. **User Signup/Login**
   - User registers using Clerk authentication.
   - Lands on dashboard after login.

2. **Create or Import Survey**
   - User imports a Google Forms link or creates a survey structure.
   - System stores survey metadata and questions.

3. **Configure Distribution Campaign**
   - User selects distribution method:
     - Email campaign
     - Shareable link
     - QR code generation
   - User defines target audience list (email upload or manual entry).

4. **Launch Survey Campaign**
   - System sends emails or generates shareable access links.
   - QR code is made available for offline/physical distribution.

5. **Engagement Tracking Begins**
   - System tracks:
     - Email opens
     - Link clicks
     - Survey starts
     - Survey completions

6. **Respondent Completes Survey**
   - Users interact via:
     - Standard form view OR
     - Conversational survey interface (one question at a time)

7. **Automated Follow-ups**
   - System sends reminders to non-respondents based on schedule rules.

8. **Analytics & Insights**
   - Dashboard displays:
     - Response rates
     - Drop-off points
     - Question-level performance
     - AI-generated summaries and sentiment analysis

9. **(Optional) Simulation Mode**
   - User enables simulation mode explicitly.
   - System generates limited synthetic responses using predefined personas.
   - Results are displayed separately from real data.

---

## ⚙️ Features by Category

### 1. Survey Management

- Google Forms import integration
- Basic survey structure storage
- Survey metadata management

### 2. Distribution Engine

- Email-based campaign distribution (Resend)
- Shareable links
- QR code generation
- Audience list management
- Campaign scheduling

### 3. Engagement Tracking

- Email open tracking
- Link click tracking
- Response tracking
- Drop-off detection
- Campaign performance metrics

### 4. Survey Experience Layer

- Standard survey view
- Conversational chat-style survey UI (one question at a time)
- Mobile-friendly response interface

### 5. AI-Powered Analytics

- Response summarization (Google Gemini API)
- Sentiment analysis
- Response quality scoring
- Per-question insights

### 6. Automation System

- Automated reminders for non-respondents
- Scheduled follow-up emails
- Basic engagement optimization rules

### 7. Simulation Mode (Controlled AI Feature)

- Synthetic response generation using predefined personas
- Limited response count per simulation run
- Strict separation from real survey data
- Used for:
  - Survey testing
  - Pilot validation
  - Question clarity evaluation

### 8. Analytics Dashboard

- Response rate visualization
- Engagement metrics
- Drop-off analysis
- Question-level analytics
- AI-generated insight summaries

### 9. Report Export (PDF Download)

- Generate downloadable PDF reports for completed surveys
- Include:
  - response summary
  - key metrics (response rate, completion rate)
  - AI-generated insights (summary, sentiment, quality scoring)
  - question-wise breakdown
- Clean, structured report format suitable for academic and government use
- One-click export from analytics dashboard

---

## 📦 In-Scope (MVP)

We are building:

- Survey import via Google Forms link
- Email-based distribution system
- Link sharing + QR code generation
- Campaign tracking (opens, clicks, responses)
- Automated email reminders
- Conversational survey interface (non-AI driven flow logic)
- Survey response collection and storage
- AI-based analysis:
  - summarization
  - sentiment detection
  - response quality scoring
- Analytics dashboard
- Controlled synthetic response simulation mode
- Authentication and user management (Clerk integration)

---

## 🚫 Out-of-Scope (MVP)

We are NOT building:

- Survey marketplace or public survey discovery platform
- Social media integration or sharing automation
- CRM system functionality
- WhatsApp or social messaging automation
- Full autonomous AI interviewer replacing surveys
- Predictive research automation system
- University management system
- Full respondent recruitment marketplace
- Complex workflow automation engine beyond reminders

---

## 🧠 Success Criteria

The MVP will be considered successful if:

1. Users can successfully import or create a survey and launch a campaign.
2. Surveys can be distributed via email and shareable links without errors.
3. Campaign tracking correctly reflects opens, clicks, and responses.
4. Users receive automated reminders for incomplete responses.
5. At least one AI feature (summary, sentiment, or scoring) produces useful insights.
6. Conversational survey mode improves completion experience compared to standard form flow.
7. Simulation mode generates controlled synthetic responses without mixing with real data.
8. Dashboard clearly visualizes survey performance metrics.
9. System is stable enough for multiple concurrent survey campaigns.
10. End-to-end flow (create → distribute → collect → analyze) works without manual intervention.

---
