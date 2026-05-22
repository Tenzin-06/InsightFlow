## Goal

Establish a scalable AI-assisted development workflow for InsightFlow using Claude Code subagents, Git worktrees, isolated feature branches, and spec-driven task execution.

The outcome of this unit is a production-safe parallel development system where multiple Claude Code subagents can independently implement isolated specifications without interfering with the main repository, shared branches, or each other’s work.

---

# Design

## Multi-Agent Development Philosophy

The development workflow should prioritize:

- branch isolation
- parallel feature execution
- repository safety
- deterministic task ownership
- scalable AI collaboration
- predictable merge workflows
- spec-driven implementation
- clean Git history

The system should enable multiple Claude Code sessions/subagents to work simultaneously on independent features while preserving repository integrity.

---

## Workflow Architecture Philosophy

Each feature implementation should follow:

```txt
Specification File
    ↓
Dedicated Subagent
    ↓
Dedicated Git Branch
    ↓
Dedicated Git Worktree
    ↓
Independent Claude Session
    ↓
Feature Completion
    ↓
Pull Request
    ↓
Review & Merge
```

---

## Isolation Philosophy

Every subagent must operate inside:

- isolated Git branch
- isolated worktree
- isolated Claude session
- isolated implementation scope

Subagents must never directly modify:

- `main`
- unrelated feature branches
- unrelated specifications
- shared configuration outside assigned scope

---

## Specification Ownership Model

Each spec file becomes a development contract for one subagent.

Example ownership:

| Spec | Assigned Subagent |
|---|---|
| Unit 12 — Google Forms Import UI | import-ui-agent |
| Unit 13 — Google Forms Import System | import-backend-agent |
| Unit 14 — AI Workflow | workflow-agent |
| Unit 15 — Analytics Engine | analytics-agent |

---

## Repository Safety Philosophy

The workflow should prevent:

- accidental commits to `main`
- overlapping feature edits
- branch contamination
- unstable merge chains
- AI-generated repository corruption

The repository must remain deployable at all times.

---

## Branching Philosophy

Every subagent should use:

```txt
feature/<feature-name>
```

Example:

```txt
feature/google-forms-ui
feature/google-forms-backend
feature/analytics-engine
feature/ai-workflow
```

---

## Worktree Philosophy

Git worktrees should provide:

- parallel working directories
- isolated dependency execution
- separate Claude contexts
- branch-safe development
- independent testing environments

---

## Claude Subagent Philosophy

Each Claude subagent should:

- own one responsibility
- implement one spec at a time
- avoid unrelated modifications
- follow architectural boundaries
- respect repository conventions

Subagents should function similarly to specialized engineering teams.

---

# Implementation

# 1. Claude Code Installation & Initialization

## Objective

Prepare Claude Code for isolated multi-agent development workflows.

---

## Requirements

Install:

- Git
- Node.js
- Claude Code CLI

---

## Initial Repository Validation

Verify Git setup:

```bash
git status
```

Verify Claude CLI:

```bash
claude
```

---

## Initial Claude Trust Initialization

Before worktrees are used:

- open the repository once normally
- allow workspace trust
- validate Claude access permissions

---

# 2. Repository Preparation

## Objective

Ensure repository is clean before multi-agent execution.

---

## Required Workflow

Update main branch:

```bash
git checkout main
git pull origin main
```

---

## Repository State Rules

Before spawning subagents:

- no uncommitted changes
- no unresolved merge conflicts
- no unstable builds
- main branch must compile successfully

---

# 3. Claude Worktree Infrastructure

## Objective

Enable isolated development environments.

---

## Worktree Root

Recommended structure:

```txt
/.claude/worktrees/
```

---

## Git Ignore Configuration

Add to:

```txt
.gitignore
```

Add:

```gitignore
.claude/worktrees/
```

---

## Worktree Benefits

Each worktree provides:

- isolated filesystem
- isolated branch
- independent terminal
- independent Claude session

---

# 4. Subagent Directory Structure

## Objective

Create reusable specialized subagent definitions.

---

## Recommended Structure

```txt
/.claude
├── agents
│   ├── frontend-agent.md
│   ├── backend-agent.md
│   ├── analytics-agent.md
│   ├── import-agent.md
│   ├── auth-agent.md
│   └── workflow-agent.md
│
├── prompts
│   ├── implementation-rules.md
│   ├── branch-rules.md
│   └── coding-standards.md
│
└── worktrees
```

---

# 5. Subagent Definitions

## Objective

Create reusable Claude specialization profiles.

---

## Example Agent

### File

```txt
.claude/agents/frontend-agent.md
```

---

## Example Structure

```yaml
---
name: frontend-agent
description: Frontend UI implementation specialist
model: sonnet
isolation: worktree
---

You are responsible only for frontend implementation tasks.

Rules:
- Do not modify backend files
- Do not update unrelated dependencies
- Follow existing frontend architecture
- Keep changes isolated to assigned spec
```

---

## Additional Recommended Agents

| Agent | Responsibility |
|---|---|
| frontend-agent | UI & UX implementation |
| backend-agent | Django & API systems |
| auth-agent | Clerk authentication |
| analytics-agent | Metrics & AI insights |
| import-agent | Google Forms import system |
| workflow-agent | AI workflow orchestration |

---

# 6. Feature Branch Workflow

## Objective

Ensure isolated Git history per feature.

---

## Branch Naming Convention

Use:

```txt
feature/<feature-name>
```

---

## Examples

```txt
feature/google-forms-ui
feature/google-forms-backend
feature/analytics-dashboard
feature/ai-insights
```

---

## Branch Creation Workflow

```bash
git checkout main
git pull origin main
git checkout -b feature/google-forms-ui
```

---

## Branch Rules

Subagents must:

- never commit directly to main
- never reuse unrelated branches
- never force-push shared branches

---

# 7. Git Worktree Workflow

## Objective

Enable parallel feature implementation safely.

---

## Create Worktree

Example:

```bash
git worktree add .claude/worktrees/google-forms-ui feature/google-forms-ui
```

---

## Result

Creates:

```txt
.claude/worktrees/google-forms-ui
```

connected to:

```txt
feature/google-forms-ui
```

---

## Multiple Parallel Worktrees

Example:

```bash
git worktree add .claude/worktrees/import-backend feature/google-forms-backend

git worktree add .claude/worktrees/analytics feature/analytics-dashboard
```

---

## Worktree Rules

Each worktree should:

- run independently
- maintain isolated branch state
- avoid shared temporary files
- contain isolated Claude session

---

# 8. Claude Subagent Execution Workflow

## Objective

Assign isolated specification ownership to Claude.

---

## Example Workflow

### Terminal 1

```bash
cd .claude/worktrees/google-forms-ui
claude
```

---

### Prompt Example

```txt
Implement Unit 12 — Google Forms Import UI.

Rules:
- Modify only frontend import-related files
- Do not modify backend systems
- Do not refactor unrelated components
- Follow existing InsightFlow architecture
- Keep commits focused and isolated
```

---

## Terminal 2

```bash
cd .claude/worktrees/google-forms-backend
claude
```

---

## Prompt Example

```txt
Implement Unit 13 — Google Forms Import System.

Rules:
- Modify only backend import logic
- Do not touch frontend UI
- Keep APIs versioned under /api/v1/
- Follow Django service architecture
```

---

# 9. Spec Assignment Strategy

## Objective

Prevent overlapping development conflicts.

---

## Recommended Assignment Rules

Each subagent should own:

- one spec
- one feature area
- one branch
- one worktree

---

## Conflict Prevention

Avoid assigning multiple subagents to:

- same React component
- same Django app
- same Prisma/schema file
- same Tailwind configuration
- same package dependency upgrade

---

# 10. Environment Synchronization

## Objective

Ensure worktrees remain executable.

---

## Shared Environment Files

Recommended shared files:

```txt
.env
.env.local
.env.development
```

---

## Environment Strategy

Each worktree should support:

- frontend execution
- backend execution
- local API access
- Clerk authentication
- database connectivity

---

## Optional Shared Sync Strategy

Recommended helper file:

```txt
.worktreeinclude
```

---

## Example

```txt
.env
.env.local
```

---

# 11. Dependency Management Rules

## Objective

Prevent dependency conflicts between subagents.

---

## Rules

Subagents should:

- avoid upgrading unrelated dependencies
- isolate package additions
- document dependency changes clearly

---

## Dependency Review Requirement

Any subagent modifying:

```txt
package.json
requirements.txt
```

must justify the modification.

---

# 12. Pull Request Workflow

## Objective

Maintain controlled repository integration.

---

## Required Workflow

After feature completion:

```bash
git add .
git commit -m "Implement Google Forms import UI"
git push origin feature/google-forms-ui
```

---

## Pull Request Rules

Every feature branch must:

- open independent PR
- include scoped changes only
- avoid unrelated formatting changes
- pass lint/build validation

---

## Merge Strategy

Recommended:

```txt
Squash and merge
```

for clean history.

---

# 13. Validation & Testing Workflow

## Objective

Ensure subagent work remains production-safe.

---

## Required Validation

Before PR creation:

### Frontend

```bash
npm run lint
npm run build
```

---

### Backend

```bash
python manage.py test
```

---

## Required Checks

Subagents must verify:

- no TypeScript errors
- no ESLint failures
- no failing backend tests
- no broken imports
- no environment regressions

---

# 14. Repository Protection Rules

## Objective

Prevent accidental repository corruption.

---

## Protected Rules

Never allow subagents to:

- delete unrelated directories
- rewrite Git history
- force-push shared branches
- mass-format entire repository
- modify secrets
- alter production environment configs unnecessarily

---

## Main Branch Protection

Recommended GitHub settings:

- require pull requests
- require status checks
- disable direct pushes to main

---

# 15. Developer Workflow Recommendations

## Objective

Optimize long-term AI-assisted development.

---

## Recommended Development Order

Implement features incrementally:

```txt
Foundation
→ Authentication
→ Survey Management
→ Import Systems
→ Analytics
→ AI Features
→ Optimization
```

---

## Recommended Merge Strategy

Merge:

- one stable feature at a time
- after validation
- after build verification

Avoid merging many unfinished branches simultaneously.

---

# 16. Future Workflow Scalability

## Objective

Prepare InsightFlow for larger multi-agent workflows.

---

## Future Enhancements

Architecture should support:

- autonomous issue assignment
- automated branch creation
- AI-generated PR descriptions
- CI-integrated validation
- multi-agent orchestration
- automated merge conflict detection

---

## Future AI Roles

Potential future agents:

| Agent | Responsibility |
|---|---|
| testing-agent | Automated QA |
| refactor-agent | Code quality optimization |
| performance-agent | Optimization & profiling |
| documentation-agent | Spec & docs generation |

---

# 17. Accessibility & Documentation Standards

## Objective

Maintain readable and maintainable workflows.

---

## Documentation Rules

Each subagent should:

- write meaningful commit messages
- preserve architectural consistency
- avoid cryptic abstractions
- document major architectural changes

---

## Commit Message Examples

```txt
Implement survey metadata persistence
Add Google Forms import loading states
Create analytics dashboard chart components
```

---

# 18. Developer Experience Standards

## Objective

Maintain scalable AI-assisted engineering workflows.

---

## Rules

Subagent workflows should:

- remain deterministic
- isolate responsibilities
- minimize repository conflicts
- preserve maintainability

---

## Architectural Principles

Prefer:

- isolated branches
- modular features
- scoped commits
- incremental merges

Avoid:

- giant multi-feature branches
- unrelated refactors
- cross-feature dependency coupling
- direct main branch development

---

# Dependencies

# Core Development Dependencies

## Git & Workflow

```bash
git version 2.30+
```

---

## Claude Code

Install Claude Code CLI.

---

## Existing Frontend Dependencies

Already available from previous units:

```txt
react
vite
typescript
tailwindcss
shadcn/ui
react-router-dom
```

---

## Existing Backend Dependencies

Already available:

```txt
django
djangorestframework
psycopg2-binary
```

---

# Optional Recommended Tooling

## GitHub CLI

```bash
gh
```

for PR management.

---

## Recommended VSCode Extensions

- GitLens
- ESLint
- Tailwind CSS IntelliSense
- Python
- Prettier

---

# Verification Checklist

# Repository Preparation

- [ ] Main branch updated successfully
- [ ] Repository clean before worktree creation
- [ ] `.gitignore` configured correctly

---

# Worktree Infrastructure

- [ ] Worktree directories created successfully
- [ ] Branches isolated correctly
- [ ] Multiple worktrees operate independently

---

# Claude Subagents

- [ ] Agent definitions created
- [ ] Claude sessions isolated correctly
- [ ] Spec ownership clearly assigned

---

# Git Workflow

- [ ] Feature branches created correctly
- [ ] No direct commits to main
- [ ] PR workflow operational
- [ ] Commit history remains clean

---

# Environment Management

- [ ] `.env` accessible across worktrees
- [ ] Frontend runs inside worktrees
- [ ] Backend runs inside worktrees

---

# Repository Safety

- [ ] No branch contamination occurs
- [ ] Merge conflicts minimized
- [ ] Main branch remains stable
- [ ] Unrelated files remain untouched

---

# Validation Workflow

- [ ] Frontend lint passes
- [ ] Frontend build succeeds
- [ ] Backend tests pass
- [ ] No TypeScript errors

---

# Developer Experience

- [ ] Parallel feature development works
- [ ] Specs map clearly to agents
- [ ] Workflow scales for future units
- [ ] Repository remains maintainable

---

# Visible Result

By the end of Unit 14:

- InsightFlow supports parallel AI-assisted feature development
- Claude Code subagents operate safely in isolated worktrees
- feature branches remain independent and production-safe
- specifications map cleanly to isolated development workflows
- GitHub PR workflows remain organized and maintainable
- repository corruption risks are minimized
- scalable AI-driven engineering infrastructure is established
- InsightFlow is prepared for large-scale parallel feature implementation using Claude Code subagents