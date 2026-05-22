# Branch & Repository Safety Rules

## Hard rules

- Never commit directly to `main`
- Never force-push any branch
- Never rewrite git history
- Never delete files outside your assigned feature scope
- Never modify secrets or production environment configs

## Per-worktree rules

- Each worktree owns exactly one feature branch
- Keep all commits scoped to the assigned spec
- If you discover a bug in unrelated code, note it in `context/progress-tracker.md` under "Open Questions" — do not fix it

## Router conflicts (frontend agents)

When adding routes to `src/app/router/index.tsx`:
- Add only the routes defined in your spec
- Do not remove or reorder existing routes
- Conflicts will be resolved at merge time — that is expected

## Before pushing

```bash
git status          # confirm only your files are staged
git diff --staged   # review what will be committed
git push origin <your-branch>
```
