# Implementation Rules

These rules apply to every subagent session.

## Before coding

1. Read all context files in the order specified by CLAUDE.md
2. Read your assigned spec file fully before writing any code
3. Identify exactly which files you will create or modify — no more

## Scope

- Implement only what the spec describes
- Do not refactor unrelated code
- Do not add features not in the spec
- Do not upgrade unrelated dependencies
- Do not mass-format files you did not author

## Quality gates (must pass before committing)

### Frontend
```
cd frontend
npm run lint
npm run build
```

### Backend
```
cd backend
python manage.py check
python manage.py test
```

## Progress tracking

After completing your spec, append to `context/progress-tracker.md`:

```
- **Unit <N>: <Spec Name>**
  - `path/to/file.ts` — what was added or changed
  - ...
```

## Commit format

```
Implement <spec name>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```
