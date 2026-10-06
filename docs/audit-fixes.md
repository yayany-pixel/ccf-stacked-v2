# Website audit fixes

The unfinished instructor routes now show the same coming-soon notice. They do not accept credentials, show demonstration records, or suggest that a session exists. Instructor authentication was not enabled.

Every page main landmark has a `main-content` target with `tabIndex={-1}` for the global keyboard skip link. Teaching pages share their layout's main landmark.

Optional tracking defaults to off. The privacy banner offers rejection, acceptance, and separate analytics/advertising choices; the footer reopens the preferences dialog. Google and Meta libraries load only after the relevant approval. Browser Global Privacy Control and Do Not Track signals override saved grants. Errors loading or saving preferences never enable additional tracking, and withdrawals take effect immediately in the current page.

The automatic Simple Analytics integration was disabled in the build environment because its injected handlers run ahead of application middleware and do not honor these consent choices. Google Analytics remains available after explicit analytics approval; Google Ads and Meta remain available after advertising approval. Simple Analytics should not be re-enabled until the integration provides a verified consent-aware configuration.

Preferences use an anonymous, random identifier in an essential HttpOnly, SameSite cookie, with Secure enabled on HTTPS. The choices live in Netlify Database, not local storage. The record contains only the identifier, two choices, and expiration/update timestamps. Choices expire after 180 days, and the scheduled cleanup removes expired records daily. The included SQL migration must be applied by Netlify's deploy lifecycle before the persistence endpoint is used. If the database is unavailable, tracking remains off and the UI offers a retry.

The `/api/privacy` endpoint is a dedicated Netlify Function so preference submissions are handled as API requests rather than by the site's form-submission middleware. It supports GET and POST, validates origin and payloads, and returns private, non-cacheable responses.

`next.config.mjs` is the single security-header configuration. Production CSP no longer allows eval, blocks object embeds and framing, and restricts base URLs and native form submissions. Required Google, Meta, Acuity and YouTube origins remain allowed. Inline scripts remain allowed because the existing statically rendered Next.js application requires them; removing this allowance needs a separate nonce-based rendering change. Development retains eval for the framework's tooling.

Sitemap entries omit unknown modification dates. Blog entries keep their content-specific update dates.

## Validation

Run `npm run test:audit`, `npm run test:analytics`, `npm run test:meta`, and `npm run test:homepage` for isolated regression checks.

With Netlify Dev on port 8889, run `npm run test:audit:browser` for desktop/mobile consent and keyboard checks. The browser tests mock preference storage and block external traffic and real submissions; they do not modify customer records or send tracking events to providers. Existing analytics and Meta browser tests explicitly mock approved preferences to test opted-in behavior.

Production header propagation and the database migration need verification on the platform deployment. No production build is required by these local checks.
