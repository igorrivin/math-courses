# Patterns, Proofs, and Primes — interactive companion

The number theory course website runs on
[vinext](https://github.com/cloudflare/vinext), with optional Cloudflare D1 and
Drizzle support. Reuse the existing Site in .openai/hosting.json and preserve
its public audience and numbertheoryintro.dimensionreducers.ai custom domain.

The September 10, 2026 revision expands Chapter 3 of the downloadable book
with linear fractional transformations, matrix composition, prefix
conjugation, complete elementary Lagrange and Galois proofs, period reversal,
and seven exercises with solutions. The continued-fraction lab introduces the
same ideas. The editable book lives in the sibling ../book folder;
public/course-packet.pdf must match its compiled patterns_proofs_primes.pdf.

The book's Pell section now proves the exact complete-quotient remainder
identity, the period-parity rule, the palindrome before the final `2a_0`,
and generation of every positive solution. An optional Archimedes cattle
section follows the reduction to Pell and its extra divisibility condition,
with a reference to Vardi's exposition. Eight further exercises and their
solutions accompany the revision. The first book notebook supplies exact
integer calculations, including verification of the 206,545-digit total.

Chapter 4 now emphasizes extended gcd, constructive CRT, its connection to
Lagrange interpolation, and Fibonacci periodicity via reversible pairs.
The modular lab displays an integer Bézout certificate for the chosen step
and explains whether it has an inverse. Chapter 5 and Notebook 2 extend the
necklace argument from length 9 to prime powers, then use CRT to prove
Euler's theorem and the totient product formula without inclusion–exclusion.
The necklace lab links this argument and distinguishes the sum formula over
the prime field from the polynomial identity that holds
in extensions. Optional Appendix D now develops rings, characteristic,
bases and dimension, quadratic extensions, cyclic multiplicative groups,
and existence and uniqueness of finite fields up to isomorphism. Matrix
counts, Frobenius, automorphisms, and subfields lead to Fibonacci periods.
A final bonus proves that every finite division ring is a field using
Witt's cyclotomic argument. It has 18 exercises with solutions. Notebook 2 follows
the same teaching order and also runs in standard Python; its marked `.sage`
source is converted and mirrored by `scripts/sync-notebooks.py`.

Sections 5.8–5.11 now cover multiplicative functions and Möbius inversion,
then bonus treatments of posets, inclusion–exclusion, incidence algebras,
and Fourier inversion as interpolation at roots of unity. Notebook 6 checks
the counts and both kinds of inversion using exact arithmetic in SageMath
or standard Python. The companion links these sections and all six notebooks.

## Problem sets, quizzes, and instructor editions

`/assessments` lists the student PDFs; `/instructors` requires the shared
instructor password. Configure `INSTRUCTOR_PASSWORD` as a Sites secret (or in
an ignored local `.env` file). An empty value keeps access closed. Instructor
PDFs live in `private/` and are served only after a server-side session check.
See [setup and maintenance](../../docs/instructor-access.md).

Problem Set 3 covers totients, multiplicative functions, divisor inversion,
necklaces, and squarefree counts (8 problems, 100 points, plus a challenge).
Problem Set 4 is optional enrichment on posets, partition counts,
roots-of-unity interpolation, and cyclic convolution (6 problems, 80 points,
plus a challenge). Both include separate student and instructor editions;
their editable sources live in `../problem-sets/problem-set-03/` and
`../problem-sets/problem-set-04/`. The catalog and PDF copies are maintained
by `scripts/sync-assessments.py` from the repository root.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

This starter does not use `wrangler.jsonc`.

## Included Shape

- edit site code under `app/`
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from
`oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the course site and verify its rendered lessons, nine labs, protected instructor downloads, metadata, and PDF asset
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
