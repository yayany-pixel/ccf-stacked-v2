# Team supplier library

The internal directory is at `/team/suppliers`. It contains dated public-price research and saved quote-request context for Chicago and Eugene.

Maintain the private working copy of `lib/supplier-directory.json` (ignored by Git), then encrypt it to `lib/supplier-directory.enc.json` before committing. The source repository is public, so only authenticated AES-256-GCM ciphertext is committed. The runtime key `CCF_SUPPLIER_DATA_KEY` is a Netlify secret in the production Functions scope; the local working key lives in ignored `.env.supplier-data.local`. Never commit either key or plaintext research. Keep source links, package sizes, verification dates and stock/quote caveats. “Best price found” applies only to the options researched; shipping and tax can change the ranking. Do not add customer information or vendor account credentials to this data.

The server route checks HTTP Basic authentication before returning HTML, JSON or CSV. Username is `ccf`; the random password is shared separately with the team and never committed. Netlify's production Functions scope holds `CCF_SUPPLIER_PASSWORD_SHA256`, marked as a secret. Explicit deploy context is required by Secrets Controller; an all-context secret is rejected. Preview deployments fail closed unless their own secret is configured. No middleware-only access check is used.

Re-encrypt updates with `node --env-file=.env.supplier-data.local scripts/encrypt-supplier-directory.cjs`. Keep a private offline backup of the plaintext and local key; only the encrypted output belongs in Git.

All responses disable shared caching and search indexing. The page is intentionally outside the public navigation and sitemap. It loads no analytics or third-party scripts. Close the browser session after use on a shared computer.

To rotate access, generate a fresh high-entropy password, update its SHA-256 verifier in Netlify with the secret flag and explicit production/Functions scope, rebuild, and share the replacement securely. Never put the password or verifier in this repository.

Validation: `node --env-file=.env.supplier-data.local --import tsx tests/supplier-library.ts`, Next production build, and browser checks for searching, category/destination filters, responsive layout and protected exports. Local Next development must load the same ignored key file. Data decrypts only on the server after authentication; a missing or incorrect key fails closed.
