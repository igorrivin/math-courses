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

## Problem sets, quizzes, and instructor editions

`/assessments` lists the student PDFs; `/instructors` requires the shared
instructor password. Configure `INSTRUCTOR_PASSWORD` as a Sites secret (or in
an ignored local `.env` file). An empty value keeps access closed. Instructor
PDFs live in `private/` and are served only after a server-side session check.
See [setup and maintenance](../../docs/instructor-access.md).

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
- `npm test`: build the course site and verify its rendered lessons, seven labs, metadata, and PDF asset
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
