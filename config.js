/* Veyloro site configuration.
 *
 * googleClientId — the OAuth 2.0 Client ID for "Sign in with Google".
 * Create one at https://console.cloud.google.com/apis/credentials:
 *   Create credentials -> OAuth client ID -> Web application
 *   Authorised JavaScript origins:  https://hmarucheck.github.io
 *                                   http://localhost:8000   (for local testing)
 * Paste the ID below. It ends in .apps.googleusercontent.com and is not a secret —
 * client IDs are public by design; the client *secret* is never used here and must
 * never be committed.
 *
 * Leave it empty and the sign-in page explains the setup instead of showing a
 * button that cannot work.
 */
window.VEYLORO_CONFIG = {
  googleClientId: ""
};
