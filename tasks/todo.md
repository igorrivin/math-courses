# Number theory book publication — 2026-10-16

The publication was already in progress when the repository planning
instructions were supplied. Remaining plan: confirm the existing deployment,
verify the public book against the compiled PDF, and record the result here.

- [x] Expand the finite-fields appendix, including existence and uniqueness,
  Frobenius and subfields, and the Wedderburn bonus; update solutions and docs.
- [x] Compile the book, check examples with exact arithmetic, and inspect the PDF.
- [x] Open the existing public Site in a separate checkout and copy only the
  revised `public/course-packet.pdf` and its README documentation.
- [x] Build and pass all 26 existing website tests; package and push the exact
  source state to the Site source repository.
- [x] Save Site version 16 and request production deployment.
- [x] Confirm successful deployment of the existing Site (version 16).
- [x] Verify that the public PDF matches the compiled 127-page book and report
  the live download URL.

Owning files: `number-theory/book/`, `number-theory/website/public/course-packet.pdf`,
and `number-theory/website/README.md`. The deployment preserves the hosted
assessment catalog and other existing Site content. The mathematics repository
has separate pending edits from the review-material and book work.

Site: `appgprj_6a7cbb0e569081919995f0ffb82fc9ba`.
Saved version: `appgprj_6a7cbb0e569081919995f0ffb82fc9ba~appgver_e149336debe48191b842cf7594f5ada6`.
Site source commit: `362aa7b753a0d0af20aa69eb37ba2520cc88df3f`.
Deployment: `appgdep_6ad286abcf008191bfca94a2b476e03a`, status `succeeded`.
Returned production URL: `https://patterns-proofs-primes-course.ig-riv.chatgpt.site`.

Verification adjustment: the initial direct request to the custom-domain PDF
returned HTTP 403. Keep the successful publication intact; retry the read-only
download check outside the sandbox before attributing the response to the Site.

Final verification: the original Python client received Cloudflare error 1010
inside and outside the sandbox. Repeating the public read with the descriptive
`MathCoursesDeploymentCheck/1.0` user agent returned HTTP 200 on both the custom
domain and the returned production domain. Both downloads match the compiled
127-page book byte for byte (1,028,597 bytes), with SHA-256
`ca1376f417d34cf518568fec107e7a5a4ebb1dbc374f11b74c6d1c31ab60f5bb`.
No website access settings or application code were changed for this check.

Live book: https://numbertheoryintro.dimensionreducers.ai/course-packet.pdf

# Probability book augmentation — 2026-10-16

Plan: extend the probability book's existing expectation and distributions
material rather than duplicate its current uniform coupon-collector section.
Keep new expositions in chapter-owned input files, preserve existing exercise
numbers and PDF destinations, and give worked answers to new exercises.

- [x] Inspect Chapters 4–5, existing coupon exercises, and primary references.
- [x] Extend Chapter 4 with elegant linearity examples, including random
  spaghetti loops with a precisely specified matching model.
- [x] Extend Chapter 5 with unequal coupon probabilities and a dedicated
  Poissonization section connecting independent counts and exponential clocks.
- [x] Develop the mechanisms and assumptions behind standard distributions,
  with derived examples and a clear distinction between exact laws and limits.
- [x] Update exercises, solutions, reference sheets, course guide, and READMEs.
- [x] Verify identities and small cases with exact arithmetic; compile and
  inspect the revised book and refresh both PDF copies.
- [x] Use the Sites workflow to publish the updated book on the existing
  probability Site, run the applicable website checks, and verify the live PDF.

Owning files: `probability-statistics/book/chapters/04_random_variables.tex`,
`05_standard_distributions.tex`, their new topic inputs, `solutions.tex`,
`reference.tex`, `course_design.tex`, `book/main.tex`, and the book/site READMEs.
Publication updates `probability-statistics/website/public/course-packet.pdf`
and the matching Site source, preserving unrelated local and hosted work.
Site ID: `appgprj_6a7cf72e780c81918568284a9e806531`.

Placement check: keep new numbered Chapter 5 sections after the original
continuous section and its practice block, so existing website PDF destinations
retain their meanings. The new Chapter 4 examples and unequal-coupon treatment
use subsections inside existing sections. Existing exercises retain numbers
1–20 in Chapter 4 and 1–17 in Chapter 5; new practice starts at 21 and 18.

Verification: `python3 scripts/check-probability-enrichment.py` passes using
only exact rational arithmetic, exhaustive small matchings/permutations,
finite-draw occupancy enumeration, independent missing-set recurrences,
polynomial integration, and rational Taylor bounds. All 25 Chapter 4 and
27 Chapter 5 exercises have worked answers. The final book has 98 PDF pages,
with no TeX warnings or overfull/underfull boxes. Existing named section
destinations were compared against the prior PDF; the new pages were inspected.

Publication preparation: the existing probability Site remains public at
`https://introproba.dimensionreducers.ai`, currently version 7. Its source
helper is fetching into `/tmp/probability-site-publish-xrim8ean`; no source
objects have arrived yet. Wait for or diagnose this fetch before editing
the hosted checkout; do not replace its existing content from the local tree.

The stalled fetch was interrupted through its own recorded tool session.
An outside-sandbox retry reported an expired credential; renewing the same
Site credential and reopening completed successfully. Opened Site source:
`78784640c49a730229d5e8e9795cdb04b62edb1f`. The README, dependencies, and
prior book match the local versions; the assessment catalogs differ, so preserve
the hosted catalog and publish only the revised book PDF and README.

Published probability Site version 8. Source commit:
`84e03d60ace72f5fae162113061eae91bfe8b216`.
Saved version:
`appgprj_6a7cf72e780c81918568284a9e806531~appgver_fad44fc081808191bdb47543e1dea6c0`.
Deployment: `appgdep_6ad2932bf6fc819187fba92e8489a080`, status `succeeded`.
Returned production URL: `https://chance-data-decisions-course.ig-riv.chatgpt.site`.
All 27 existing website tests passed after the build, including public PDF
identity and protected instructor downloads. The public custom-domain PDF
returned HTTP 200 and matches the compiled 98-page book byte for byte
(828,798 bytes), with SHA-256
`ba7f5b315c365051db7fe41285973a241c65227f5d723ff281d016b87485e782`.

Live probability book: https://introproba.dimensionreducers.ai/course-packet.pdf
