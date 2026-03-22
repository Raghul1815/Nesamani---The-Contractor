/* ═══════════════════════════════════════════════════════════════
   NESAMANI — api.js
   Complete API layer for the Spring Boot backend.

   Requires: auth.js  (must be loaded before this file)

   Usage in any page:
     <script src="auth.js"></script>
     <script src="api.js"></script>
     <script src="worker-dashboard.js"></script>

   Every function returns:
     { success: true,  data: <response body> }   on success
     { success: false, error: <message string> }  on failure

   No function throws — always check .success before using .data.
═══════════════════════════════════════════════════════════════ */

const API_BASE_URL = 'http://localhost:8080';

/* ─────────────────────────────────────────────────────────────
   CORE FETCH WRAPPER
   All API calls go through this.
   • Adds Authorization: Bearer token (from auth.js)
   • Returns { success, data } or { success, error }
   • On 401 → clears session + redirects to login
───────────────────────────────────────────────────────────── */
async function apiCall(method, path, body = null, requiresAuth = true) {
  try {
    const headers = { 'Content-Type': 'application/json' };

    if (requiresAuth) {
      const token = getSession('token');   // from auth.js
      if (!token) {
        window.location.href = 'login.html';
        return { success: false, error: 'Not authenticated.' };
      }
      headers['Authorization'] = 'Bearer ' + token;
    }

    const options = { method, headers };
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(API_BASE_URL + path, options);

    /* Session expired — redirect to login */
    if (res.status === 401) {
      clearSession();   // from auth.js
      window.location.href = 'login.html';
      return { success: false, error: 'Session expired. Please log in again.' };
    }

    /* Parse response body */
    let data = null;
    const contentType = res.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      const errMsg = (data && data.error) || (data && data.message) || `Error ${res.status}`;
      return { success: false, error: errMsg };
    }

    return { success: true, data };

  } catch (err) {
    /* Network error — backend not running */
    console.warn('[api.js] Network error:', err.message);
    return { success: false, error: 'Cannot reach the server. Please check your connection.' };
  }
}

/* Shorthand helpers */
const GET    = (path, auth = true)         => apiCall('GET',    path, null, auth);
const POST   = (path, body, auth = true)   => apiCall('POST',   path, body, auth);
const PUT    = (path, body, auth = true)   => apiCall('PUT',    path, body, auth);
const PATCH  = (path, body, auth = true)   => apiCall('PATCH',  path, body, auth);
const DELETE = (path, auth = true)         => apiCall('DELETE', path, null, auth);


/* ═══════════════════════════════════════════════════════════════
   AUTH  —  /api/auth/**  (no token required)
═══════════════════════════════════════════════════════════════ */
const AuthAPI = {

  /**
   * Register a new user.
   * @param {{ name, email, phone, password, role: "worker"|"provider" }} data
   */
  register(data) {
    return POST('/api/auth/register', data, false);
  },

  /**
   * Login. On success, call saveSession(result.data) then redirectByRole(result.data.role)
   * @param {{ email, password }} data
   * @returns {{ token, role, name, userId, email, phone }}
   */
  login(data) {
    return POST('/api/auth/login', data, false);
  }
};


/* ═══════════════════════════════════════════════════════════════
   PUBLIC  —  no token required
═══════════════════════════════════════════════════════════════ */
const PublicAPI = {

  /**
   * Browse all open jobs. Optional filters.
   * @param {{ category?, location? }} filters
   */
  getOpenJobs(filters = {}) {
    const params = buildQuery(filters);
    return GET(`/api/jobs/open${params}`, false);
  },

  /**
   * Browse all workers. Optional filters.
   * @param {{ category?, location? }} filters
   */
  getWorkers(filters = {}) {
    const params = buildQuery(filters);
    return GET(`/api/workers${params}`, false);
  }
};


/* ═══════════════════════════════════════════════════════════════
   WORKER API  —  /api/worker/**  (role = WORKER)
═══════════════════════════════════════════════════════════════ */
const WorkerAPI = {

  /**
   * Worker dashboard — stats + recent applications + open jobs nearby.
   */
  getDashboard() {
    return GET('/api/worker/dashboard');
  },

  /**
   * Browse open jobs (authenticated worker view).
   * @param {{ category?, location? }} filters
   */
  browseJobs(filters = {}) {
    const params = buildQuery(filters);
    return GET(`/api/worker/jobs${params}`);
  },

  /**
   * Apply to a job.
   * @param {number} jobId
   * @param {{ coverNote?, quotedPrice? }} data
   */
  applyToJob(jobId, data = {}) {
    return POST(`/api/worker/jobs/${jobId}/apply`, data);
  },

  /**
   * Get all my applications.
   * Optional status filter: 'applied' | 'accepted' | 'completed' | 'rejected'
   * @param {string?} status
   */
  getMyApplications(status = null) {
    const params = status ? `?status=${status}` : '';
    return GET(`/api/worker/applications${params}`);
  },

  /**
   * Update worker profile.
   * @param {{ name?, phone?, location?, bio?, category? }} data
   */
  updateProfile(data) {
    return PUT('/api/worker/profile', data);
  }
};


/* ═══════════════════════════════════════════════════════════════
   CUSTOMER / PROVIDER API  —  /api/customer/**  (role = PROVIDER)
═══════════════════════════════════════════════════════════════ */
const CustomerAPI = {

  /**
   * Provider dashboard — stats + active jobs + available workers.
   */
  getDashboard() {
    return GET('/api/customer/dashboard');
  },

  /**
   * Post a new job.
   * @param {{ title, category, location, budget?, duration?, description?, date? }} data
   */
  postJob(data) {
    return POST('/api/customer/jobs', data);
  },

  /**
   * Get all my posted jobs.
   */
  getMyJobs() {
    return GET('/api/customer/jobs');
  },

  /**
   * Change a job's status.
   * @param {number} jobId
   * @param {'OPEN'|'ACTIVE'|'COMPLETED'|'CANCELLED'} status
   */
  updateJobStatus(jobId, status) {
    return PUT(`/api/customer/jobs/${jobId}/status?status=${status}`, null);
  },

  /**
   * Delete a job posting.
   * @param {number} jobId
   */
  deleteJob(jobId) {
    return DELETE(`/api/customer/jobs/${jobId}`);
  },

  /**
   * View all applicants for one of my jobs.
   * @param {number} jobId
   */
  getApplicationsForJob(jobId) {
    return GET(`/api/customer/jobs/${jobId}/applications`);
  },

  /**
   * Accept a worker's application.
   * @param {number} applicationId
   */
  acceptApplication(applicationId) {
    return PUT(`/api/customer/applications/${applicationId}/accept`, null);
  },

  /**
   * Reject a worker's application.
   * @param {number} applicationId
   */
  rejectApplication(applicationId) {
    return PUT(`/api/customer/applications/${applicationId}/reject`, null);
  },

  /**
   * Update provider profile.
   * @param {{ name?, phone?, location?, bio? }} data
   */
  updateProfile(data) {
    return PUT('/api/customer/profile', data);
  }
};


/* ═══════════════════════════════════════════════════════════════
   MESSAGES API  —  /api/messages/**  (any authenticated user)
═══════════════════════════════════════════════════════════════ */
const MessagesAPI = {

  /**
   * Get all conversations for the logged-in user.
   */
  getConversations() {
    return GET('/api/messages');
  },

  /**
   * Get messages in a specific conversation with another user.
   * @param {number} otherUserId
   */
  getConversation(otherUserId) {
    return GET(`/api/messages/${otherUserId}`);
  },

  /**
   * Send a message to another user.
   * @param {number} toUserId
   * @param {string} message
   */
  send(toUserId, message) {
    return POST('/api/messages/send', { toUserId, message });
  },

  /**
   * Mark all messages in a conversation as read.
   * @param {number} otherUserId
   */
  markRead(otherUserId) {
    return PATCH(`/api/messages/${otherUserId}/read`, null);
  }
};


/* ═══════════════════════════════════════════════════════════════
   NOTIFICATIONS API  —  /api/notifications/**
═══════════════════════════════════════════════════════════════ */
const NotificationsAPI = {

  /**
   * Get all notifications for the logged-in user.
   */
  getAll() {
    return GET('/api/notifications');
  },

  /**
   * Mark a single notification as read.
   * @param {number} notifId
   */
  markRead(notifId) {
    return PATCH(`/api/notifications/${notifId}/read`, null);
  },

  /**
   * Mark all notifications as read.
   */
  markAllRead() {
    return PATCH('/api/notifications/read-all', null);
  }
};


/* ═══════════════════════════════════════════════════════════════
   REVIEWS API  —  /api/reviews/**
═══════════════════════════════════════════════════════════════ */
const ReviewsAPI = {

  /**
   * Leave a review after a completed job.
   * @param {{ jobId, reviewedId, rating: 1-5, comment? }} data
   */
  submit(data) {
    return POST('/api/reviews', data);
  },

  /**
   * Get all reviews for a specific user.
   * @param {number} userId
   */
  getForUser(userId) {
    return GET(`/api/reviews/user/${userId}`, false);
  }
};


/* ═══════════════════════════════════════════════════════════════
   UTILITY
═══════════════════════════════════════════════════════════════ */

/**
 * Convert a plain object to a URL query string.
 * buildQuery({ category: 'Plumbing', location: 'Trichy' })
 * → "?category=Plumbing&location=Trichy"
 */
function buildQuery(params) {
  const entries = Object.entries(params).filter(([, v]) => v != null && v !== '');
  if (!entries.length) return '';
  return '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
}


/* ═══════════════════════════════════════════════════════════════
   CONVENIENCE — single API object you can use anywhere
═══════════════════════════════════════════════════════════════

   Examples:

   // Login
   const res = await API.auth.login({ email, password });
   if (res.success) {
     saveSession(res.data);
     redirectByRole(res.data.role);
   } else {
     showToast(res.error, true);
   }

   // Worker: get dashboard
   const res = await API.worker.getDashboard();
   if (res.success) renderStats(res.data);

   // Provider: post a job
   const res = await API.customer.postJob({ title, category, location, budget });
   if (res.success) showToast('Job posted!');
   else showToast(res.error, true);

   // Browse workers (public)
   const res = await API.public.getWorkers({ category: 'Plumbing', location: 'Trichy' });
   if (res.success) renderWorkerCards(res.data);

   // Send a message
   const res = await API.messages.send(workerId, 'Can you come tomorrow?');

═══════════════════════════════════════════════════════════════ */
const API = {
  auth:          AuthAPI,
  public:        PublicAPI,
  worker:        WorkerAPI,
  customer:      CustomerAPI,
  messages:      MessagesAPI,
  notifications: NotificationsAPI,
  reviews:       ReviewsAPI
};