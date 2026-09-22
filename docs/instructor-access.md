# Assessment pages and instructor access

Each course website has three pages:

- `/assessments`: all student problem sets and quizzes, freely downloadable.
- `/instructor-access`: the shared-password form.
- `/instructors`: instructor editions, with links to the matching student handouts.

The same instructor password can be used for both courses. Each site maintains
its own browser session, so sign in separately on each domain.

## Configure access

Set `INSTRUCTOR_PASSWORD` to the same randomly generated value on both Sites.
Use at least 20 characters and at most 256. Store the production value as a
secret through Sites environment variables, and deploy a saved version to apply
the environment revision. Do not put the value in source, hosting metadata,
a `NEXT_PUBLIC_` variable, or Git configuration.

For local development, copy each website's `.env.example` to `.env` and set the
value there. These files are ignored by Git. Without a configured password,
instructor access stays closed and the form explains that access is unavailable.

Changing the password also invalidates existing sessions. Sessions expire after
eight hours and use a signed, host-bound, Secure, HttpOnly, SameSite=Strict cookie.
The sign-out button removes the browser's cookie. Share the password only with
instructors; this shared-password gate does not provide individual accounts or
per-instructor revocation.

## Update the handouts

1. Compile the student and instructor editions in their assessment source folders.
2. Add or update the entry in `scripts/assessment-catalog.json`.
3. Run `python3 scripts/sync-assessments.py` from the repository root.
4. Run `python3 scripts/sync-assessments.py --check` and `npm test` in each website.

The sync script copies only the listed student PDFs to `public/`, preserving
existing URLs such as `/problem-set-02.pdf`. Instructor PDFs go to `private/`.
It also generates each website's `content/assessments.json` with the public
descriptions and download names.

The build plugin embeds instructor PDFs in the server Worker. It rejects client
imports and never emits those files as static assets. The Worker checks the
session before rendering instructor pages, RSC responses, or file downloads.
Protected responses use `Cache-Control: private, no-store` and are marked not to
be indexed. Login and logout require same-origin POST requests, password checks
use constant-time comparison, and repeated failed attempts are throttled within
each Worker instance. That throttle is not a global account lockout; keep the
shared password long and randomly generated.

The two websites remain independently deployable, so the access module, build
plugin, resource components, and their tests are included in each website.
When changing this shared behavior, update both copies and run both test suites.

The tests check the complete sign-in/download/sign-out flow, expiry, tampering,
password rotation, request origins, anonymous HTML/RSC/download denial, and the
absence of instructor PDF bytes from public assets and browser bundles.
