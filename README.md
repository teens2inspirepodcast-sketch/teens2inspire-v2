# Teens2Inspire.org

This project is the **public Teens2Inspire website and account hub**.

## Architecture

- `teens2inspire.org` — marketing site, account creation/login, school information, events, contact, and app installation instructions.
- `media.teens2inspire.org` — separate media PWA/app that owns the member content, media library, profiles, and admin studio.

This website intentionally does **not** contain the member media library or the `/v2` app UI.

## Account types

- School — free with an active school code.
- Personal — $7.99/month, one profile.
- Family — $9.99/month, up to three profiles.

Stripe checkout remains server-side. Supabase Auth handles account creation and email verification.

## Production Supabase Auth settings

Set the Supabase project Site URL to:

`https://teens2inspire.org`

Allow this redirect URL:

`https://teens2inspire.org/auth/callback`

The signup flow builds the verification redirect from the live website origin, so production verification returns to the Teens2Inspire website rather than localhost.

## Required production environment variables

Copy `.env.example` into the deployment environment and supply the real values. Never commit secret keys.

## School codes

The migration `20261002010000_school_codes.sql` creates the school-code tables used by the signup validation endpoint. Apply it to the production Supabase project before enabling school-code signup.

## Deploy

Deploy this folder as the Vercel project for `teens2inspire.org`.
