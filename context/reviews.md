- Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@backend/apps/surveys/views/question_views.py` around lines 27 - 30, The list
method in QuestionViewSet is bypassing DRF pagination by directly serializing
self.get_queryset(); update QuestionViewSet.list (and do the same for
SurveyViewSet.list) to follow the DRF list lifecycle: call queryset =
self.filter_queryset(self.get_queryset()), then page =
self.paginate_queryset(queryset) and if page is not None return
self.get_paginated_response(self.get_serializer(page, many=True).data),
otherwise return the standard Response with {"success": True, "data":
serializer.data, "error": None}; this restores LimitOffsetPagination/PAGE_SIZE
behavior and retains future filter backends.

- Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/progress-tracker.md` at line 24, Update the phrase describing the
landing page in the progress tracker by changing "full page assembly" to the
grammatically correct compound adjective "full-page assembly" where the entry
references src/features/marketing/pages/landing-page.tsx so the line reads
"`src/features/marketing/pages/landing-page.tsx` — full-page assembly with
Navbar, Hero, Features, Workflow, Analytics, CTAs, Footer".

- Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/progress-tracker.md` at line 11, Resolve the conflicting status for
Unit 10 by making both entries consistent: locate the entry "Unit 10: Survey
Management UI (in progress)" and the later summary/summary line that marks Unit
10 as complete, decide the correct status, and update both occurrences to the
same wording (e.g., "Unit 10: Survey Management UI — Complete" or "Unit 10:
Survey Management UI — In progress"). Ensure any summary line that currently
states "nothing is in progress" is adjusted to reflect the chosen state so the
tracker is unambiguous.

- Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@frontend/src/app/router/index.tsx` around lines 17 - 21, The PageLoader
fallback lacks SR-visible status text; update the PageLoader component to
include an accessible status region (e.g., add role="status" and/or
aria-live="polite") and include a screen-reader-visible label like "Loading…"
alongside the spinner so assistive tech announces progress; keep the spinner
decorative (aria-hidden="true") and use an existing CSS utility or a
visually-hidden span for the text so sighted UI is unchanged.

- Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@frontend/src/features/marketing/components/footer.tsx` around lines 18 - 21,
The legalLinks array in footer.tsx uses placeholder "#" URLs for Privacy Policy
and Terms of Service; replace these with the real public URLs (or internal
routes like "/privacy" and "/terms") and make them configurable (e.g., via
siteConfig, env vars, or Footer props) so they can be updated without code
changes; also update any other instances of these placeholder links in the same
file to use the actual/configurable URLs to ensure legal docs are reachable.

- Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@frontend/src/features/marketing/components/footer.tsx` around lines 23 - 27,
The socialLinks array currently uses placeholder "#" hrefs which break
navigation; update socialLinks (and the other occurrence around the footer
rendering) to use real URLs sourced from configuration or environment (e.g.,
NEXT_PUBLIC_SOCIAL_*) or passed-in props (e.g., socialLinksConfig) instead of
hardcoded "#", and ensure the Footer component that renders these links uses the
updated values (and optionally adds target="_blank" rel="noopener noreferrer"
for external links).

- Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@frontend/src/features/marketing/components/navbar.tsx` around lines 11 - 17,
The effect that registers the scroll handler never initializes the scrolled
state on mount, so header may show wrong styles until a scroll occurs; inside
the useEffect that defines onScroll and calls window.addEventListener, invoke
onScroll() once immediately (before returning the cleanup) so setScrolled is
initialized based on current window.scrollY; keep the existing listener
registration and cleanup (window.removeEventListener) as-is.

- Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@frontend/src/features/marketing/components/mobile-nav.tsx` around lines 15 -
20, The mobile nav's navLinks array contains a broken "Pricing" hash link
(navLinks -> { label: "Pricing", href: "`#pricing`" }) with no matching
id="pricing" on the page; fix by either removing that entry from navLinks in
mobile-nav.tsx or by adding a corresponding section with id="pricing" in the
landing page component so the hash target exists (make sure the section markup
and any anchors use id="pricing" so the link works).

- Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@frontend/src/features/marketing/components/scroll-reveal.tsx` around lines 26
- 32, Clamp the incoming threshold prop to the valid [0,1] range before
constructing the IntersectionObserver to avoid RangeError; specifically, inside
the ScrollReveal component, compute a safeThreshold (e.g., Math.min(1,
Math.max(0, threshold || 0))) and pass that safeThreshold into the
IntersectionObserver call that currently uses threshold, leaving the rest of the
observer callback (setVisible and behavior) unchanged.

- Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@frontend/src/features/marketing/components/scroll-reveal.tsx` around lines 55
- 66, Update the style branch in scroll-reveal.tsx to respect
prefers-reduced-motion: detect reducedMotion via
window.matchMedia("(prefers-reduced-motion: reduce)").matches (guard for SSR),
and when reducedMotion is true apply only opacity toggling (e.g., style uses
opacity: visible ? 1 : 0 and transform: "none"), set transition to "none", and
remove willChange; otherwise keep the existing logic that uses revealed/initial,
the transition string built from delay, and willChange "opacity, transform".
Ensure you reference the existing visible, revealed, initial and delay variables
so behavior toggles without changing other props.

- Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@frontend/src/features/surveys/components/inline-question-card.tsx` around
lines 167 - 171, The keyboard handler on the pseudo-button in
inline-question-card.tsx currently only handles Enter; update the onKeyDown used
on the element with role="button" so it also activates on Space key presses
(check e.key for ' ' and legacy 'Spacebar' as well as 'Enter'), call
e.preventDefault() to avoid page scrolling when Space is pressed, and then
invoke onActivate() — locate the JSX with role="button" and the existing
onKeyDown={(e) => e.key === "Enter" && onActivate()} and replace it with a
handler that checks for Enter or Space, prevents default, and calls
onActivate().

- Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@frontend/src/features/surveys/components/survey-editor.tsx` around lines 51 -
60, handleAddQuestion currently sets the new question's order using
sorted.length which can produce duplicate order values after deletions; instead
compute the new order as (max existing order among items in sorted) + 1 (use 1
when there are no items). Update the createQuestion.mutate call to calculate
order by iterating sorted (or mapping to their order property) to find
Math.max(...) and add one, and ensure you handle missing/undefined order values
safely before passing the computed order into createQuestion.mutate.

- Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@frontend/src/features/surveys/components/survey-editor.tsx` around lines 69 -
83, handleMoveUp and handleMoveDown perform two separate updateQuestion.mutate
calls to swap orders, which can leave inconsistent state if one call fails;
change this to a single atomic operation by introducing and calling a
server-side transactional endpoint (e.g., reorderQuestions or updateQuestion
with a swap payload) that swaps the two questions' order in one request, or wrap
both updates in a backend DB transaction, then update the client handlers
(handleMoveUp/handleMoveDown) to call that single endpoint (pass ids and desired
swap) and remove the two-mutate pattern to ensure atomic reordering.

- Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@frontend/src/features/surveys/pages/survey-detail-page.tsx` around lines 39 -
45, The delete handler allows repeated submissions; update handleDelete to no-op
if deleteSurvey.isPending is true and ensure the delete button(s) in the
SurveyDetailPage component are disabled while deleteSurvey.isPending;
specifically, guard inside handleDelete (return early when
deleteSurvey.isPending), and set the button props (the delete button rendered
near lines ~100-105) to disabled={deleteSurvey.isPending} so users cannot click
while the mutation is in flight.

- Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@frontend/src/features/surveys/pages/survey-list-page.tsx` around lines 1 - 2,
The page state can become out-of-range when the total result count or perPage
changes (e.g., deleting the last item on the last page); add logic in the
SurveyListPage component to clamp the current page whenever totalResults or
perPage changes: compute maxPage = Math.max(0, Math.ceil(totalResults / perPage)
- 1) and call setPage(prev => Math.min(prev, maxPage)) (or reset to 0 if
totalResults === 0). Apply this clamp wherever page is derived/used (the page
state variable, setPage calls, and any pagination render logic) so page never
exceeds the available pages after deletions or perPage changes. Ensure the clamp
runs in an effect (useEffect) that depends on [totalResults, perPage] or is
included in the same memoized logic that computes paginatedRows.

- Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@frontend/src/features/surveys/pages/survey-list-page.tsx` around lines 60 -
62, Update the awkward subtitle text in the <p className="mt-0.5 text-sm
text-text-secondary"> element in the SurveyListPage component: replace "Survey
every field to create and filter a survey." with clearer copy such as "Survey
each field to create and filter surveys." to fix grammar and improve clarity for
users.

- Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@frontend/src/index.css` around lines 111 - 119, The fade-in and fade-up
keyframes animate unconditionally; add a prefers-reduced-motion media-query that
disables or reduces these animations for users who request reduced motion by
overriding animation and transition properties for the selectors that use
`@keyframes` fade-in and `@keyframes` fade-up (or globally target elements using
these animations) so animations become none or have zero duration under `@media`
(prefers-reduced-motion: reduce); update the CSS near the `@keyframes` definitions
to include this media query and explicit overrides for animation/transition
properties.
