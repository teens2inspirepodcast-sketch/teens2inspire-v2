# Teens2Inspire

Teens2Inspire is a Next.js 16 media and community platform for Jewish teen girls. The current production experience is V2 at `/v2`; its public editorial and membership pages are available from the root navigation.

## Local setup

Requirements: Node.js 22.12 or newer and npm.

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` and fill in the public Supabase URL and publishable key.
3. Add the server-only Supabase secret key for private media signing, Stripe customer synchronization, and webhook processing.
4. Set `NEXT_PUBLIC_SITE_URL` to the public origin, then run `npm run dev`.

Never put Supabase secret/service-role keys, Stripe secret keys, or webhook secrets in a `NEXT_PUBLIC_` variable. `.env.local` and other `.env.*` files are ignored by Git.

## Database and storage

Supabase is the system of record for accounts, roles, content, R2 object keys, favorites, progress, event registrations, subscriptions, membership permissions, and moderated community/support data. The checked-in migrations through atomic event registration were applied to the connected `teens2inspire` project. The new R2 content-key migration is additive and has not been applied. Before applying it, link only the intended project, inspect its migration ledger, verify a restorable backup, and review the SQL; do not reset or recreate the existing database.

These migrations extend the existing Teens2Inspire Supabase schema; they are not a full schema export of that pre-existing project. To create a reproducible local or new Supabase environment, first establish and review a baseline from the intended project with `supabase db pull` (which requires the database password), then keep that baseline and these additive migrations in version control. Do not run `supabase db reset` against the connected project.

Supabase is the source of truth for authentication, profiles, content metadata, R2 object keys, permissions, and synchronized Stripe membership state. Cloudflare R2 stores the bytes:

- The private R2 bucket holds podcast/video media, printables/downloads, and profile photos. Supabase stores each content `r2_media_key` and each user's private avatar key. V2 issues short-lived R2 signed URLs only after checking the Supabase session and membership/content permissions.
- The public R2 bucket holds approved artwork. Supabase stores `r2_thumbnail_key`; the configured R2 custom domain serves those public image objects.
- R2 credentials and bucket names stay server-only. Studio and profile uploads request a narrowly scoped, five-minute presigned PUT URL from the server, then upload directly from the browser to R2. Configure each bucket's CORS to allow the intended Vercel origin(s), `PUT`, and the `Content-Type` header.

Set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PRIVATE_BUCKET_NAME`, and `R2_PUBLIC_BUCKET_NAME` in the server environment. Set `R2_PUBLIC_BASE_URL` to the public artwork bucket's HTTPS custom domain; it is public URL configuration, not a credential. Create least-privilege R2 API credentials scoped to these buckets and only the required object operations.

Older objects and profile paths already stored in Supabase Storage are not moved or deleted. V2 no longer uploads new media there, and legacy Supabase Storage media URLs are not signed for playback. Re-upload approved existing files to R2 through the administrator Studio and save their new keys when R2 is configured. This is an explicit per-file migration; the application does not copy or delete old objects automatically.

Do not seed fictional member accounts, subscriptions, comments, or published media. Create categories and homepage shelves in the administrator Content Studio, then publish only licensed and approved content.

To regenerate database types after a migration, link the project and run `npm run db:types`.

## Roles and safe community

The administrator Content Studio is at `/v2/admin`; community moderation and the private support inbox are at `/v2/admin/community`. Both require a server-verified administrator role. Members cannot access CMS or private inquiry data. Community posts are pending until a moderator approves them. Direct member-to-member messaging is intentionally not enabled; support messages are private to the account and Teens2Inspire administrators.

## Stripe configuration

Configure the following server-only environment values in local development and the deployment environment:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID_PERSONAL` and `STRIPE_PRICE_ID_FAMILY` for the recurring membership Prices
- `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) for trusted Stripe webhook synchronization
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PRIVATE_BUCKET_NAME`, and `R2_PUBLIC_BUCKET_NAME` for Cloudflare R2 access (server-only)
- `R2_PUBLIC_BASE_URL` for the public artwork bucket's HTTPS custom domain

Create a Stripe webhook endpoint at `https://YOUR_DOMAIN/api/stripe/webhook` and subscribe it to `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, and `invoice.payment_failed`. Copy Stripe’s signing secret into `STRIPE_WEBHOOK_SECRET`. The handler verifies Stripe’s signature, records event IDs, safely retries failures, and updates membership only from verified subscription state. The success return URL does not activate a membership.

Enable the Stripe Billing Portal for the configured Stripe account so members can update payment details and cancel subscriptions. Complete the checkout and webhook flow with Stripe test-mode keys and a test recurring Price before switching to live keys.

## Quality checks

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run build`

Playwright runs the public, authentication-gate, mobile viewport, and brand/no-emoji checks. Live checkout, subscription changes, member-only media, and administrator publishing require configured Stripe and test accounts to exercise end to end.

## Deployment checklist

1. This V2 workspace is connected to the dedicated empty-then-initialized repository `https://github.com/teens2inspirepodcast-sketch/teens2inspire-v2`. Keep the earlier `teens2inspirepodcast-sketch/Teens2inspire.org` repository and its deployment separate. Connect only the V2 repository to a new, owner-confirmed Vercel project running Node.js 22.12 or newer.
2. Vercel should detect Next.js automatically. Use `npm ci` for install, `npm run build` for build, and `npm run start` for local production-mode smoke checks. Runtime requirement is Node.js 22.12 or newer; deploy as a Next.js application (not a static export) so server components and API routes remain enabled.
3. Configure these Vercel environment variables before the production build:
   - Public: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SITE_URL` (the actual HTTPS production origin).
   - Server-only: `SUPABASE_SECRET_KEY` (or legacy `SUPABASE_SERVICE_ROLE_KEY`), `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_PERSONAL`, `STRIPE_PRICE_ID_FAMILY`, `STRIPE_WEBHOOK_SECRET`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PRIVATE_BUCKET_NAME`, and `R2_PUBLIC_BUCKET_NAME`.
   - Public image delivery: `R2_PUBLIC_BASE_URL` set to the HTTPS custom domain attached to the public artwork bucket.
   - This app uses Stripe-hosted Checkout and Billing Portal sessions; it does not need a Stripe publishable key in the browser. Never put server-only values in `NEXT_PUBLIC_*` variables.
4. Set the Supabase Auth Site URL to the production origin, add the production `/auth/callback` redirect URL, configure email confirmation/recovery delivery, enable leaked-password protection, and review existing school/family `SECURITY DEFINER` helpers. These are owner-level Supabase Auth/security settings; this workspace does not change them.
5. Before applying migrations, link only the intended project, inspect its migration ledger, take/verify a restorable backup, and review the migration SQL plan. The checked-in migrations extend the existing schema; do not reset or recreate the current database. A fresh environment requires a separately reviewed schema baseline; see Safe database baseline and migrations below.
6. Configure the Stripe recurring Price and enable its Customer Portal. After a stable deployment exists, configure the webhook at `https://YOUR_DOMAIN/api/stripe/webhook` for `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, and `invoice.payment_failed`. Use Stripe test mode to verify checkout, webhook synchronization, membership access, portal, cancellation, and failed-payment handling before live mode.
7. Confirm privacy/terms, teen age and guardian-consent requirements, retention practices, and regional compliance with the organization’s counsel before accepting public signups.
8. Configure the approved production domain and DNS, verify HTTPS and redirects, set the canonical site URL above, configure monitoring/rate limiting for public form and auth endpoints, and create a verified administrator profile through the organization’s approved provisioning process. Never grant admin rights from public signup metadata.

The V2 media integration uses Supabase metadata/auth and Cloudflare R2 object storage. No R2 credentials, bucket configuration, or custom artwork domain are present in this workspace, so uploads and signed media delivery cannot be exercised until those are configured. An existing production content row currently points to Supabase Storage; it remains untouched and needs an approved admin re-upload to R2 before that file can play in V2.

This workspace is not connected to a Vercel project, and no deployment has been made or represented as verified. Connect the V2 GitHub repository above to a new, owner-confirmed Vercel project. Production Stripe credentials/Price, Supabase server secret and production auth configuration, R2 credentials/buckets/custom domain, and organization-approved legal/consent configuration are still required.

### Safe database baseline and migrations

The connected Supabase project predates the checked-in migrations: its migration ledger includes older migrations not present in this repository, and the earliest checked-in migration assumes existing base tables. The checked-in files are additive changes, not a complete database bootstrap. Never run `supabase db reset` or apply these migrations to a new/production project as if they recreate the full schema. For a fresh environment, first use the Supabase CLI linked to the intended source project and its database password to pull a schema-only baseline; review it for secrets, ownership, extensions, RLS, policies, triggers, and functions, then commit the reviewed baseline separately from additive migrations. Reconcile migration history against the target project's ledger before applying any change. Confirm a restorable backup and review the SQL plan before production changes. No destructive database operation is part of ordinary deployment.
