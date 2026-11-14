# bordro.pages.dev shared content + management panel setup

The website and Android app read the same content from the Pages Functions API, backed by Cloudflare KV. The app does not contain an administrator password.

## One-time Cloudflare setup

1. In Cloudflare, open **Workers & Pages → KV** and create a namespace, for example `bordro-content`.
2. Open the Pages project serving `bordro.pages.dev` → **Settings → Functions → KV namespace bindings**. Bind the namespace with variable name **`BORDRO_CONTENT`**.
3. In that Pages project, add these three **Secrets** (not plain-text variables):
   - `BORDRO_ADMIN_USERNAME`: the administrator username you choose.
   - `BORDRO_ADMIN_PASSWORD`: a long, unique password.
   - `BORDRO_SESSION_SECRET`: a separate random secret of at least 32 characters.
4. Redeploy the Pages project after the functions and bindings are in place.
5. Open `https://bordro.pages.dev/yonetim.html` (or the Yönetim panel inside the app), sign in, edit the JSON, and choose **Kaydet ve yayınla**.

The API routes are `/api/content` (public read), `/api/admin/login` (credentials accepted only over HTTPS), and `/api/admin/content` (signed, expiring admin token required). Admin sessions last 12 hours. The KV binding is shared by the website and app, so a saved change is reflected by both on their next refresh. The app keeps the latest successfully fetched content for offline viewing.

The default public content is supplied by `functions/_utils.js` until KV receives its first saved update. Do not put credentials in the repository or APK. Rotate the Cloudflare secrets if they are ever exposed.
