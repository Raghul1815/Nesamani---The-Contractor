/* ═══════════════════════════════════════════
   NESAMANI — api.js
   Complete API layer — all endpoints.
   Requires: auth.js loaded first.

   Returns: { success:true, data } | { success:false, error }
   Never throws — always check .success first.
   ═══════════════════════════════════════════ */

const API_BASE_URL = 'http://localhost:8080';

/* ── Core fetch wrapper ── */
async function apiCall(method, path, body = null, requiresAuth = true) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (requiresAuth) {
      const token = getSession('token');
      if (!token) { window.location.href = 'login.html'; return { success:false, error:'Not authenticated.' }; }
      headers['Authorization'] = 'Bearer ' + token;
    }
    const options = { method, headers };
    if (body && ['POST','PUT','PATCH'].includes(method)) options.body = JSON.stringify(body);
    const res = await fetch(API_BASE_URL + path, options);
    if (res.status === 401) { clearSession(); window.location.href = 'login.html'; return { success:false, error:'Session expired.' }; }
    let data = null;
    const ct = res.headers.get('Content-Type') || '';
    data = ct.includes('application/json') ? await res.json() : await res.text();
    if (!res.ok) return { success:false, error:(data && (data.error || data.message)) || `Error ${res.status}` };
    return { success:true, data };
  } catch (err) {
    console.warn('[api.js]', err.message);
    return { success:false, error:'Cannot reach the server. Please check your connection.' };
  }
}

const GET    = (p, a=true)      => apiCall('GET',    p, null, a);
const POST   = (p, b, a=true)   => apiCall('POST',   p, b,    a);
const PUT    = (p, b, a=true)   => apiCall('PUT',    p, b,    a);
const PATCH  = (p, b, a=true)   => apiCall('PATCH',  p, b,    a);
const DEL    = (p, a=true)      => apiCall('DELETE', p, null, a);
const Q      = o => { const e=Object.entries(o).filter(([,v])=>v!=null&&v!==''); return e.length?'?'+e.map(([k,v])=>`${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&'):''; };


/* ════════════════════════════════════════
   AUTH  (public — no token needed)
   POST /api/auth/register
   POST /api/auth/login  → { token, role:"needer"|"provider", name, userId, email }
════════════════════════════════════════ */
const AuthAPI = {
  register: d => POST('/api/auth/register', d, false),
  login:    d => POST('/api/auth/login',    d, false)
};


/* ════════════════════════════════════════
   PUBLIC  (no token needed)
════════════════════════════════════════ */
const PublicAPI = {
  /* Browse all open jobs  GET /api/jobs/open?category=&location= */
  getOpenJobs: (f={}) => GET(`/api/jobs/open${Q(f)}`, false),
  /* Browse all services   GET /api/services?category=&location= */
  getServices: (f={}) => GET(`/api/services${Q(f)}`, false),
  /* Browse all providers  GET /api/providers?category=&location= */
  getProviders:(f={}) => GET(`/api/providers${Q(f)}`, false)
};


/* ════════════════════════════════════════
   NEEDER API  →  /api/needer/**
   requiresAuth: role = NEEDER
════════════════════════════════════════ */
const NeederAPI = {

  /* Dashboard stats + active jobs + available providers */
  getDashboard: () => GET('/api/needer/dashboard'),

  /* ── Flow A: Post a job ── */
  postJob: d => POST('/api/needer/jobs', d),

  /* Get all my posted jobs  GET /api/needer/jobs?status= */
  getMyJobs: (status=null) => GET(`/api/needer/jobs${status?`?status=${status}`:''}`),

  /* Update job status  PUT /api/needer/jobs/:id/status?status=CANCELLED */
  updateJobStatus: (jobId, status) => PUT(`/api/needer/jobs/${jobId}/status?status=${status}`, null),

  /* Delete a job */
  deleteJob: jobId => DEL(`/api/needer/jobs/${jobId}`),

  /* See all provider responses for one of my jobs */
  getResponsesForJob: jobId => GET(`/api/needer/jobs/${jobId}/responses`),

  /* Accept a provider's response → auto-creates Booking */
  acceptResponse: responseId => PUT(`/api/needer/responses/${responseId}/accept`, null),

  /* Reject a provider's response */
  rejectResponse: responseId => PUT(`/api/needer/responses/${responseId}/reject`, null),

  /* ── Flow B: Book a provider directly from service listing ── */
  bookProvider: d => POST('/api/needer/bookings', d),
  /* d = { providerId, serviceId, notes, scheduledAt } */

  /* My bookings (both flows)  GET /api/needer/bookings?status= */
  getMyBookings: (status=null) => GET(`/api/needer/bookings${status?`?status=${status}`:''}`),

  /* Update profile */
  updateProfile: d => PUT('/api/needer/profile', d)
};


/* ════════════════════════════════════════
   PROVIDER API  →  /api/provider/**
   requiresAuth: role = PROVIDER
════════════════════════════════════════ */
const ProviderAPI = {

  /* Dashboard stats + recent responses + bookings */
  getDashboard: () => GET('/api/provider/dashboard'),

  /* ── Services (Flow B) ── */
  /* Get my services */
  getMyServices: () => GET('/api/provider/services'),

  /* Upload a new service */
  addService: d => POST('/api/provider/services', d),
  /* d = { title, description, category, price, priceType, location } */

  /* Update a service */
  updateService: (id, d) => PUT(`/api/provider/services/${id}`, d),

  /* Delete / deactivate a service */
  deleteService: id => DEL(`/api/provider/services/${id}`),

  /* ── Jobs (Flow A) ── */
  /* Browse open jobs posted by needers */
  browseJobs: (f={}) => GET(`/api/provider/jobs${Q(f)}`),

  /* Respond to a job */
  respondToJob: (jobId, d) => POST(`/api/provider/jobs/${jobId}/respond`, d),
  /* d = { message, quotedPrice } */

  /* My responses  GET /api/provider/responses?status= */
  getMyResponses: (status=null) => GET(`/api/provider/responses${status?`?status=${status}`:''}`),

  /* Withdraw a response */
  withdrawResponse: id => PUT(`/api/provider/responses/${id}/withdraw`, null),

  /* ── Bookings ── */
  /* My bookings received */
  getMyBookings: (status=null) => GET(`/api/provider/bookings${status?`?status=${status}`:''}`),

  /* Accept a booking */
  acceptBooking: id => PUT(`/api/provider/bookings/${id}/accept`, null),

  /* Mark booking as in-progress */
  startBooking: id => PUT(`/api/provider/bookings/${id}/start`, null),

  /* Mark booking as completed */
  completeBooking: id => PUT(`/api/provider/bookings/${id}/complete`, null),

  /* Update profile */
  updateProfile: d => PUT('/api/provider/profile', d)
};


/* ════════════════════════════════════════
   MESSAGES  →  /api/messages/**
════════════════════════════════════════ */
const MessagesAPI = {
  getConversations: ()          => GET('/api/messages'),
  getConversation:  userId      => GET(`/api/messages/${userId}`),
  send:             (toId, msg) => POST('/api/messages/send', { toUserId:toId, message:msg }),
  markRead:         userId      => PATCH(`/api/messages/${userId}/read`, null)
};


/* ════════════════════════════════════════
   NOTIFICATIONS  →  /api/notifications/**
════════════════════════════════════════ */
const NotificationsAPI = {
  getAll:      ()  => GET('/api/notifications'),
  markRead:    id  => PATCH(`/api/notifications/${id}/read`, null),
  markAllRead: ()  => PATCH('/api/notifications/read-all', null)
};


/* ════════════════════════════════════════
   REVIEWS  →  /api/reviews/**
════════════════════════════════════════ */
const ReviewsAPI = {
  submit:     d      => POST('/api/reviews', d),
  /* d = { bookingId, reviewedId, rating:1-5, comment } */
  getForUser: userId => GET(`/api/reviews/user/${userId}`, false)
};


/* ════════════════════════════════════════
   MAIN EXPORT
════════════════════════════════════════ */
const API = {
  auth:          AuthAPI,
  public:        PublicAPI,
  needer:        NeederAPI,
  provider:      ProviderAPI,
  messages:      MessagesAPI,
  notifications: NotificationsAPI,
  reviews:       ReviewsAPI
};
