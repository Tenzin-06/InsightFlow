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
The socialLinks array contains placeholder hrefs ("#") causing non-functional
external links; update the socialLinks entries (the socialLinks constant and
where it's used in the Footer component) to use the real external URLs for
GitHub, LinkedIn and Twitter/X, and ensure external links open safely (add
target="_blank" and rel="noopener noreferrer" where links are rendered). Also
update the duplicate placeholders referenced later (the other socialLinks usage
around the second block) so both places use the real URLs.

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

In `@frontend/src/index.css` around lines 111 - 119, The fade-in and fade-up
keyframes animate unconditionally; add a prefers-reduced-motion media-query that
disables or reduces these animations for users who request reduced motion by
overriding animation and transition properties for the selectors that use
`@keyframes` fade-in and `@keyframes` fade-up (or globally target elements using
these animations) so animations become none or have zero duration under `@media`
(prefers-reduced-motion: reduce); update the CSS near the `@keyframes` definitions
to include this media query and explicit overrides for animation/transition
properties.