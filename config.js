// config.js — runtime configuration. Safe to commit (no secrets).
// Paste the Apps Script Web App URL below after deploying server/Code.gs.
// See server/DEPLOY.md for the 3-minute setup.

window.CONFIG = {
  // Empty string → wizard saves submissions to localStorage only (offline demo mode).
  // Paste your Apps Script /exec URL here to enable real submissions + live pending count.
  APPS_SCRIPT_URL: '',

  // How often (ms) to re-fetch approved submissions + pending count.
  // 0 = only on initial load. 60_000 = every minute.
  REFRESH_MS: 0,

  // Honeypot field name — keep in sync with the wizard.
  HONEYPOT_FIELD: 'website',
};
