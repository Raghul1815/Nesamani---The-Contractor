/* ═══════════════════════════════════════════
   NESAMANI — auth.js
   Single source of truth for:
     • Session storage / retrieval
     • Auth guard (requireAuth)
     • Role-based redirect
     • Authenticated fetch (apiFetch)
     • Logout
   Load this BEFORE any dashboard JS file.
   ═══════════════════════════════════════════ */

const API_BASE = 'http://localhost:8080';

/* ── Storage keys (one place, never duplicated) ── */
const SESSION_KEYS = {
  token:  'nesaToken',
  role:   'nesaRole',
  name:   'nesaName',
  userId: 'nesaUserId',
  email:  'nesaEmail',
  phone:  'nesaPhone'
};

/* ─────────────────────────────────────────────────
   saveSession(data)
   Call after successful login with the API response.
   Expected shape:
     { token, role, name, userId (or id), email }
   role must be exactly  "worker"  or  "provider"
───────────────────────────────────────────────── */
function saveSession(data) {
  try {
    localStorage.setItem(SESSION_KEYS.token,  data.token            || '');
    localStorage.setItem(SESSION_KEYS.role,   data.role             || '');
    localStorage.setItem(SESSION_KEYS.name,   data.name             || '');
    localStorage.setItem(SESSION_KEYS.userId, data.userId || data.id || '');
    localStorage.setItem(SESSION_KEYS.email,  data.email            || '');
    localStorage.setItem(SESSION_KEYS.phone,  data.phone            || '');
  } catch (e) {
    console.error('[auth] saveSession failed:', e);
  }
}

/* ─────────────────────────────────────────────────
   getSession(key)
   key is one of: 'token' | 'role' | 'name' |
                  'userId' | 'email' | 'phone'
   Returns empty string when missing (never null).
───────────────────────────────────────────────── */
function getSession(key) {
  try {
    return localStorage.getItem(SESSION_KEYS[key]) || '';
  } catch (e) {
    return '';
  }
}

/* ─────────────────────────────────────────────────
   clearSession()  — wipe everything stored by Nesamani
───────────────────────────────────────────────── */
function clearSession() {
  try {
    Object.values(SESSION_KEYS).forEach(k => localStorage.removeItem(k));
  } catch (e) { /* silent */ }
}

/* ─────────────────────────────────────────────────
   redirectByRole(role)
   "worker"   → worker-dashboard.html
   "provider" → customer-dashboard.html
   anything else → login.html
───────────────────────────────────────────────── */
function redirectByRole(role) {
  if (role === 'worker') {
    window.location.href = 'worker-dashboard.html';
  } else if (role === 'provider') {
    window.location.href = 'customer-dashboard.html';
  } else {
    window.location.href = 'login.html';
  }
}

/* ─────────────────────────────────────────────────
   requireAuth(expectedRole)
   Call at the top of each dashboard page.
     expectedRole: 'worker' | 'provider'
   • No token → sends to login.html
   • Wrong role → sends to correct dashboard
   • Returns true only when token + role match.
───────────────────────────────────────────────── */
function requireAuth(expectedRole) {
  const token = getSession('token');
  const role  = getSession('role');

  if (!token) {
    window.location.href = 'login.html';
    return false;
  }
  if (expectedRole && role !== expectedRole) {
    redirectByRole(role);
    return false;
  }
  return true;
}

/* ─────────────────────────────────────────────────
   authHeaders()
   Returns headers object with Bearer token + JSON type.
   Pass to fetch() as the `headers` option.
───────────────────────────────────────────────── */
function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getSession('token')
  };
}

/* ─────────────────────────────────────────────────
   apiFetch(path, options)
   Authenticated wrapper around fetch.
   Automatically adds auth headers.
   On 401 → clears session and redirects to login.
   Usage:
     const res = await apiFetch('/api/worker/jobs');
     const res = await apiFetch('/api/customer/jobs', {
       method: 'POST', body: JSON.stringify(payload)
     });
───────────────────────────────────────────────── */
async function apiFetch(path, options = {}) {
  const headers = Object.assign({}, authHeaders(), options.headers || {});
  try {
    const res = await fetch(API_BASE + path, { ...options, headers });
    if (res.status === 401) {
      clearSession();
      window.location.href = 'login.html';
      throw new Error('Session expired. Please log in again.');
    }
    return res;
  } catch (err) {
    if (err.message && err.message.includes('Session expired')) throw err;
    /* Network error — caller handles gracefully */
    throw err;
  }
}

/* ─────────────────────────────────────────────────
   logout()
   Clears session and redirects to login page.
   Call from any dashboard's logout button.
───────────────────────────────────────────────── */
function logout() {
  clearSession();
  window.location.href = 'login.html';
}