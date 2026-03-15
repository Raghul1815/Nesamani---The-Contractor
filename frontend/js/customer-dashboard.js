/* ═══════════════════════════════════════════
   NESAMANI — customer-dashboard.js
   Requires: auth.js  (loaded first in HTML)

   All session reads use getSession() from auth.js.
   All API calls use apiFetch() from auth.js.
   All redirects use redirectByRole() / logout() from auth.js.
   ═══════════════════════════════════════════ */

/* ── State ── */
let jobData      = [];
let workerData   = [];
let notifData    = [];
let msgData      = [];
let activeThread = 0;

/* ════════════════════════════════════════
   MOCK DATA
   Replace fetch calls with real API when
   Spring Boot backend is running.
════════════════════════════════════════ */
const MOCK_JOBS = [
  { id:1, icon:'🔧', title:'Fix bathroom tap leak',        worker:'Murugan Selvam',  date:'12 Mar 2026', status:'active',    amount:'₹850' },
  { id:2, icon:'⚡', title:'Rewire living room switches',  worker:'Lakshmi Rajan',   date:'10 Mar 2026', status:'active',    amount:'₹1,200' },
  { id:3, icon:'🎨', title:'Interior wall painting',       worker:'Rajan Annamalai', date:'08 Mar 2026', status:'pending',   amount:'₹4,500' },
  { id:4, icon:'🚗', title:'Airport pickup & drop',        worker:'Senthil Kumar',   date:'05 Mar 2026', status:'completed', amount:'₹600' },
  { id:5, icon:'🏠', title:'Weekly house cleaning',        worker:'Geetha Devi',     date:'01 Mar 2026', status:'active',    amount:'₹1,800' },
  { id:6, icon:'🪵', title:'Custom bookshelf build',       worker:'Pandi Raj',       date:'26 Feb 2026', status:'completed', amount:'₹3,200' },
  { id:7, icon:'🌿', title:'Garden layout & plants',       worker:'Malar Vizhi',     date:'20 Feb 2026', status:'cancelled', amount:'₹1,500' },
  { id:8, icon:'🍳', title:'Daily cooking service',        worker:'Chitra Priya',    date:'15 Feb 2026', status:'completed', amount:'₹2,400' },
];

const MOCK_WORKERS = [
  { id:1, icon:'🔧', name:'Murugan Selvam',  role:'Plumber',     location:'Trichy',      rating:4.9, availability:'available' },
  { id:2, icon:'⚡', name:'Lakshmi Rajan',   role:'Electrician', location:'Madurai',     rating:4.8, availability:'available' },
  { id:3, icon:'🎨', name:'Rajan Annamalai', role:'Painter',     location:'Coimbatore',  rating:4.7, availability:'busy' },
  { id:4, icon:'🚗', name:'Senthil Kumar',   role:'Driver',      location:'Chennai',     rating:4.9, availability:'available' },
  { id:5, icon:'🏠', name:'Geetha Devi',     role:'Maid',        location:'Trichy',      rating:4.8, availability:'available' },
  { id:6, icon:'🪵', name:'Pandi Raj',       role:'Carpenter',   location:'Salem',       rating:4.6, availability:'available' },
  { id:7, icon:'🌿', name:'Malar Vizhi',     role:'Gardener',    location:'Erode',       rating:4.7, availability:'busy' },
  { id:8, icon:'🍳', name:'Chitra Priya',    role:'Cook',        location:'Madurai',     rating:4.9, availability:'available' },
];

const MOCK_NOTIFICATIONS = [
  { id:1, icon:'✅', msg:'<strong>Murugan Selvam</strong> accepted your tap repair request.', time:'10 mins ago', read:false },
  { id:2, icon:'💬', msg:'<strong>Lakshmi Rajan</strong> sent a message about the wiring job.', time:'2 hrs ago', read:false },
  { id:3, icon:'📋', msg:'New quote received for your <strong>"Interior Painting"</strong> job.', time:'5 hrs ago', read:false },
  { id:4, icon:'💰', msg:'Payment of ₹600 processed for airport drop job.', time:'Yesterday', read:true },
  { id:5, icon:'⭐', msg:'Please rate your experience with <strong>Senthil Kumar</strong>.', time:'2 days ago', read:true },
];

const MOCK_MESSAGES = [
  { id:101, avatar:'🔧', name:'Murugan Selvam', role:'Plumber · Trichy', preview:'I can come tomorrow at 10 AM', unread:true,
    chat:[
      { from:'them', text:'Hello! I saw your request for tap repair. I can help.', time:'9:00 AM' },
      { from:'me',   text:'Great! The tap in the bathroom is leaking badly.', time:'9:05 AM' },
      { from:'them', text:'Understood. What time suits you for a visit?', time:'9:07 AM' },
      { from:'me',   text:'Tomorrow morning would work best.', time:'9:10 AM' },
      { from:'them', text:'I can come tomorrow at 10 AM. Approximate cost: ₹600–₹900.', time:'9:12 AM' },
    ]
  },
  { id:102, avatar:'⚡', name:'Lakshmi Rajan', role:'Electrician · Madurai', preview:'Job is complete!', unread:true,
    chat:[
      { from:'me',   text:'Hi Lakshmi, the living room wiring needs urgent attention.', time:'Yesterday' },
      { from:'them', text:'I can check it today. There may be a loose connection.', time:'Yesterday' },
      { from:'them', text:'Job is complete! All wiring is safe and tested.', time:'Today 8:30 AM' },
    ]
  },
  { id:103, avatar:'🍳', name:'Chitra Priya', role:'Cook · Madurai', preview:'Menu for this week', unread:false,
    chat:[
      { from:'them', text:'Good morning! What would you like for this week\'s menu?', time:'8:00 AM' },
      { from:'me',   text:'South Indian breakfast daily, and lunch on weekends please.', time:'8:20 AM' },
      { from:'them', text:'Noted! I will prepare the weekly meal plan for your approval.', time:'8:25 AM' },
    ]
  },
];

const SPENDING_DATA = [
  {month:'Sep',val:1200},{month:'Oct',val:2200},{month:'Nov',val:1500},
  {month:'Dec',val:3000},{month:'Jan',val:1800},{month:'Feb',val:2100},{month:'Mar',val:2400}
];

/* ════════════════════════════════════════
   INIT
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

  /* ✅ Auth guard — only providers allowed (uses auth.js) */
  if (!requireAuth('provider')) return;

  /* Seed data */
  jobData    = [...MOCK_JOBS];
  workerData = [...MOCK_WORKERS];
  notifData  = [...MOCK_NOTIFICATIONS];
  msgData    = [...MOCK_MESSAGES];

  /* Populate user info from session (auth.js getSession) */
  const name  = getSession('name')  || 'Customer';
  const email = getSession('email') || '';
  const phone = getSession('phone') || '';

  safeSetText('sidebarName', name);
  safeSetText('profileName', name);
  updateGreeting(name);

  safeSetVal('pName',  name);
  safeSetVal('pEmail', email);
  safeSetVal('pPhone', phone);

  /* Try to fetch real data from Spring Boot */
  loadFromAPI();

  /* Render all sections */
  renderOverviewStats();
  renderOverviewActiveJobs();
  renderOverviewWorkers();
  renderQuickActions();
  renderMiniNotifs();
  renderAllJobs('all');
  renderWorkers();
  renderMsgThreads();
  renderChat(0);
  renderNotifications();
  renderSpendingChart();
  renderPaymentHistory();
  renderAccountStats();
});

/* ════════════════════════════════════════
   LIVE API LOAD  (graceful — falls back to mock)
════════════════════════════════════════ */
async function loadFromAPI() {
  try {
    const res = await apiFetch('/api/customer/dashboard');
    if (!res.ok) return;
    const data = await res.json();
    if (data.jobs)          { jobData    = data.jobs;          renderOverviewStats(); renderOverviewActiveJobs(); renderAllJobs('all'); }
    if (data.notifications) { notifData  = data.notifications; renderNotifications(); renderMiniNotifs(); }
    if (data.messages)      { msgData    = data.messages;       renderMsgThreads(); renderChat(0); }
  } catch (_) {
    /* Backend not running — mock data is already rendered */
  }
}

/* ════════════════════════════════════════
   NAVIGATION
════════════════════════════════════════ */
const PAGE_TITLES = {
  overview:'Overview', post:'Post a Job', jobs:'My Jobs',
  find:'Find Workers', messages:'Messages',
  spending:'Spending', notifications:'Notifications', profile:'Profile'
};

function navigate(page) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const sec = document.getElementById('sec-' + page);
  const nav = document.getElementById('nav-' + page);
  if (sec) sec.classList.add('active');
  if (nav) nav.classList.add('active');
  safeSetText('pageTitle', PAGE_TITLES[page] || '');
  const sb = document.getElementById('sidebar');
  if (sb) sb.classList.remove('open');
}

/* ════════════════════════════════════════
   HELPERS
════════════════════════════════════════ */
function safeSetText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
function safeSetVal(id, val)  { const el = document.getElementById(id); if (el) el.value = val || ''; }
function safeHTML(id, html)   { const el = document.getElementById(id); if (el) el.innerHTML = html; }

function updateGreeting(name) {
  const h = new Date().getHours();
  const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  safeSetText('greetText', `${g}, ${name.split(' ')[0]} 👋`);
}

function emptyHTML(msg) {
  return `<div style="padding:36px;text-align:center;color:var(--muted);font-size:14px;font-weight:300">${msg}</div>`;
}

/* ════════════════════════════════════════
   OVERVIEW
════════════════════════════════════════ */
function renderOverviewStats() {
  const active    = jobData.filter(j => j.status === 'active').length;
  const completed = jobData.filter(j => j.status === 'completed').length;
  const pct = jobData.length ? Math.round(completed / jobData.length * 100) : 0;
  safeHTML('overviewStats', `
    <div class="stat-card">
      <div class="stat-icon si-gold">📋</div>
      <div class="stat-val">${jobData.length}</div>
      <div class="stat-key">Total Jobs Posted</div>
      <div class="stat-delta delta-up">↑ All time</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon si-sage">✅</div>
      <div class="stat-val">${completed}</div>
      <div class="stat-key">Completed</div>
      <div class="stat-delta delta-up">↑ ${pct}% completion rate</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon si-cust">⚡</div>
      <div class="stat-val">${active}</div>
      <div class="stat-key">Active Now</div>
      <div class="stat-delta delta-warn">In progress</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon si-earth">💰</div>
      <div class="stat-val">₹12,550</div>
      <div class="stat-key">Total Spent</div>
      <div class="stat-delta delta-up">↑ Saved vs broker fees</div>
    </div>
  `);
  /* Update sidebar badge */
  const badge = document.getElementById('activeJobsBadge');
  if (badge) badge.textContent = active > 0 ? active : '';
}

function renderOverviewActiveJobs() {
  const active = jobData.filter(j => j.status === 'active').slice(0, 3);
  safeHTML('overviewActiveJobs', active.length
    ? active.map(j => jobRowHTML(j)).join('')
    : emptyHTML('No active jobs. <a href="#" onclick="navigate(\'post\')" style="color:var(--cust-accent)">Post a job →</a>')
  );
}

function renderOverviewWorkers() {
  const avail = workerData.filter(w => w.availability === 'available').slice(0, 4);
  safeHTML('overviewWorkers', avail.map(w => `
    <div style="display:flex;align-items:center;gap:8px;padding:9px;background:var(--ivory);border-radius:10px;border:1px solid rgba(201,148,58,.1);cursor:pointer;transition:border-color var(--trans)"
         onclick="showToast('Contacting ${w.name}…')"
         onmouseover="this.style.borderColor='rgba(181,69,27,.25)'"
         onmouseout="this.style.borderColor='rgba(201,148,58,.1)'">
      <span style="font-size:19px">${w.icon}</span>
      <div style="min-width:0;flex:1">
        <div style="font-size:12px;font-weight:500;color:var(--soil);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${w.name}</div>
        <div style="font-size:11px;color:var(--gold);font-weight:500">★ ${w.rating}</div>
      </div>
    </div>`).join(''));
}

function renderQuickActions() {
  safeHTML('quickActions', `
    <button class="qa-item" onclick="navigate('post')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
      <span>Post a Job</span>
    </button>
    <button class="qa-item" onclick="navigate('find')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <span>Find Worker</span>
    </button>
    <button class="qa-item" onclick="navigate('messages')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span>Messages</span>
    </button>
    <button class="qa-item" onclick="navigate('jobs')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
      <span>My Jobs</span>
    </button>
  `);
}

function renderMiniNotifs() {
  safeHTML('miniNotifs', notifData.slice(0, 3).map(n => notifRowHTML(n)).join(''));
}

/* ════════════════════════════════════════
   POST A JOB
════════════════════════════════════════ */
async function postJob() {
  const title    = (document.getElementById('jobTitle')?.value    || '').trim();
  const category = (document.getElementById('jobCategory')?.value  || '');
  const location = (document.getElementById('jobLocation')?.value  || '').trim();
  const date     = (document.getElementById('jobDate')?.value      || '');
  const budget   = (document.getElementById('jobBudget')?.value    || '').trim();
  const duration = (document.getElementById('jobDuration')?.value  || '');
  const desc     = (document.getElementById('jobDesc')?.value      || '').trim();

  if (!title)    { showToast('Please enter a job title.', true);        return; }
  if (!category) { showToast('Please select a category.', true);        return; }
  if (!location) { showToast('Please enter a location.', true);         return; }

  const btn = document.getElementById('postBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Posting…'; }

  const payload = { title, category, location, date, budget, duration, description: desc };

  try {
    const res = await apiFetch('/api/customer/jobs', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Server rejected the request.');
    const saved = await res.json();
    jobData.unshift({
      id: saved.id || Date.now(),
      icon: iconForCategory(category),
      title, worker: 'Searching…',
      date: new Date().toLocaleDateString('en-IN'),
      status: 'pending', amount: budget || '–'
    });
  } catch (_) {
    /* Offline / backend down — add to local mock */
    jobData.unshift({
      id: Date.now(),
      icon: iconForCategory(category),
      title, worker: 'Searching…',
      date: new Date().toLocaleDateString('en-IN'),
      status: 'pending', amount: budget || '–'
    });
  }

  /* Reset form */
  ['jobTitle','jobLocation','jobDate','jobBudget','jobDesc'].forEach(id => safeSetVal(id, ''));
  safeSetVal('jobCategory', '');
  safeSetVal('jobDuration', '');

  renderOverviewStats();
  renderOverviewActiveJobs();
  renderAllJobs('all');

  if (btn) { btn.disabled = false; btn.textContent = 'Post Job →'; }
  showToast('Job posted! Workers near you have been notified.');
  navigate('jobs');
}

function iconForCategory(cat) {
  const m = { Plumbing:'🔧', Electrical:'⚡', Painting:'🎨', Driving:'🚗',
    'Maid / Cleaning':'🏠', Carpentry:'🪵', Gardening:'🌿', Cooking:'🍳', Other:'🛠️' };
  return m[cat] || '🛠️';
}

/* ════════════════════════════════════════
   MY JOBS
════════════════════════════════════════ */
function renderAllJobs(filter = 'all') {
  const data = filter === 'all' ? jobData : jobData.filter(j => j.status === filter);
  safeHTML('allJobs', data.length
    ? data.map(j => jobRowHTML(j)).join('')
    : emptyHTML('No jobs in this category.')
  );
}

function filterJobs(btn) {
  document.querySelectorAll('#jobFilterTabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAllJobs(btn.dataset.f);
}

function jobRowHTML(j) {
  return `
    <div class="job-row">
      <div class="job-icon">${j.icon}</div>
      <div class="job-info">
        <div class="job-title">${j.title}</div>
        <div class="job-meta">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          ${j.worker} &nbsp;·&nbsp; ${j.date}
        </div>
      </div>
      <span class="job-status status-${j.status}">${j.status}</span>
      <span class="job-amount">${j.amount}</span>
    </div>`;
}

/* ════════════════════════════════════════
   FIND WORKERS
════════════════════════════════════════ */
function renderWorkers(query = '') {
  const data = query
    ? workerData.filter(w =>
        w.name.toLowerCase().includes(query) ||
        w.role.toLowerCase().includes(query) ||
        w.location.toLowerCase().includes(query))
    : workerData;

  safeHTML('workerGrid', data.length
    ? data.map(w => workerCardHTML(w)).join('')
    : emptyHTML('No workers found.')
  );
}

function filterWorkers() {
  const q = (document.getElementById('workerSearch')?.value || '').trim().toLowerCase();
  renderWorkers(q);
}

function workerCardHTML(w) {
  const avail = { available:'Available', busy:'Busy', offline:'Offline' }[w.availability] || '';
  return `
    <div class="w-card" onclick="contactWorker(${w.id})">
      <div class="w-card-top">
        <div class="w-avatar">
          ${w.icon}
          <div class="w-dot ${w.availability}"></div>
        </div>
        <div>
          <div class="w-name">${w.name}</div>
          <div class="w-role">${w.role} · ${w.location}</div>
          <div class="w-rating">★ ${w.rating}</div>
        </div>
      </div>
      <button class="btn-hire" onclick="event.stopPropagation();contactWorker(${w.id})">
        Hire ${w.name.split(' ')[0]} →
      </button>
    </div>`;
}

function contactWorker(id) {
  const w = workerData.find(x => x.id === id);
  if (!w) return;
  showToast(`Connecting you with ${w.name}…`);
  setTimeout(() => navigate('messages'), 900);
}

/* ════════════════════════════════════════
   MESSAGES
════════════════════════════════════════ */
function renderMsgThreads() {
  safeHTML('msgThreads', msgData.map((m, i) => `
    <div class="msg-thread ${i === activeThread ? 'active' : ''}" onclick="renderChat(${i})">
      <div class="msg-avatar">${m.avatar}</div>
      <div style="flex:1;min-width:0">
        <div class="msg-t-name">${m.name}</div>
        <div class="msg-t-preview">${m.chat[m.chat.length - 1]?.text || ''}</div>
      </div>
      ${m.unread ? '<div class="msg-unread-dot"></div>' : ''}
    </div>`).join(''));

  const badge = document.getElementById('msgBadge');
  const count = msgData.filter(m => m.unread).length;
  if (badge) badge.textContent = count > 0 ? count : '';
}

function renderChat(idx) {
  if (idx < 0 || idx >= msgData.length) return;
  activeThread = idx;
  const m = msgData[idx];
  safeSetText('chatName', m.name);
  safeSetText('chatRole', m.role);
  const avatarEl = document.getElementById('chatAvatar');
  if (avatarEl) avatarEl.textContent = m.avatar;

  safeHTML('chatBubbles', m.chat.map(c => `
    <div class="bubble ${c.from === 'me' ? 'sent' : 'recv'}">
      <div class="bubble-text">${c.text}</div>
      <div class="bubble-time">${c.time}</div>
    </div>`).join(''));

  const bubbles = document.getElementById('chatBubbles');
  if (bubbles) bubbles.scrollTop = 99999;
  m.unread = false;
  renderMsgThreads();
}

function sendMsg() {
  const input = document.getElementById('msgInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text || activeThread < 0 || activeThread >= msgData.length) return;

  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  msgData[activeThread].chat.push({ from: 'me', text, time: now });
  input.value = '';
  renderChat(activeThread);

  /* Fire and forget to backend */
  apiFetch('/api/messages/send', {
    method: 'POST',
    body: JSON.stringify({ toUserId: msgData[activeThread].id, message: text })
  }).catch(() => {});
}

/* ════════════════════════════════════════
   SPENDING CHART
════════════════════════════════════════ */
function renderSpendingChart() {
  const max = Math.max(...SPENDING_DATA.map(d => d.val));
  safeHTML('spendingChart', SPENDING_DATA.map(d => `
    <div class="bar-col" style="flex:1">
      <div class="bar" style="height:${Math.round(d.val / max * 100)}px" data-val="₹${d.val.toLocaleString('en-IN')}"></div>
      <div class="bar-label">${d.month}</div>
    </div>`).join(''));
}

function renderPaymentHistory() {
  const payments = [
    { icon:'🔧', name:'Tap Repair — Murugan',      amount:'+₹850',   date:'12 Mar', color:'var(--sage)' },
    { icon:'🚗', name:'Airport Drop — Senthil',     amount:'+₹600',   date:'05 Mar', color:'var(--sage)' },
    { icon:'🪵', name:'Bookshelf — Pandi Raj',      amount:'+₹3,200', date:'26 Feb', color:'var(--sage)' },
    { icon:'🍳', name:'Daily Cook — Chitra Priya',  amount:'+₹2,400', date:'15 Feb', color:'var(--sage)' },
    { icon:'⚡', name:'Wiring — Lakshmi Rajan',     amount:'Pending', date:'10 Mar', color:'var(--warning)' },
  ];
  safeHTML('paymentHistory', payments.map(p => `
    <div class="job-row">
      <div class="job-icon">${p.icon}</div>
      <div class="job-info">
        <div class="job-title" style="font-size:13px">${p.name}</div>
        <div class="job-meta">${p.date}</div>
      </div>
      <span style="font-size:13.5px;font-weight:600;color:${p.color}">${p.amount}</span>
    </div>`).join(''));
}

/* ════════════════════════════════════════
   NOTIFICATIONS
════════════════════════════════════════ */
function renderNotifications() {
  safeHTML('allNotifs',  notifData.map(n => notifRowHTML(n, true)).join(''));
  safeHTML('miniNotifs', notifData.slice(0, 3).map(n => notifRowHTML(n)).join(''));
  const badge = document.getElementById('notifBadge');
  const count = notifData.filter(n => !n.read).length;
  if (badge) badge.textContent = count > 0 ? count : '';
}

function notifRowHTML(n, clickable = false) {
  return `
    <div class="notif-row ${n.read ? '' : 'unread'}" ${clickable ? `onclick="markRead(${n.id})"` : ''}>
      ${!n.read ? '<div class="notif-unread-dot"></div>' : '<div style="width:7px"></div>'}
      <div class="notif-icon-wrap">${n.icon}</div>
      <div style="flex:1;min-width:0">
        <div class="notif-msg">${n.msg}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>`;
}

function markRead(id) {
  const n = notifData.find(x => x.id === id);
  if (n) n.read = true;
  renderNotifications();
}

function markAllRead() {
  notifData.forEach(n => n.read = true);
  renderNotifications();
  showToast('All notifications marked as read');
}

/* ════════════════════════════════════════
   PROFILE
════════════════════════════════════════ */
function renderAccountStats() {
  const completed = jobData.filter(j => j.status === 'completed').length;
  const stats = [
    { label: 'Member Since',    val: 'February 2025' },
    { label: 'Jobs Posted',     val: `${jobData.length}` },
    { label: 'Jobs Completed',  val: `${completed}` },
    { label: 'Reviews Given',   val: '5' },
    { label: 'Total Spent',     val: '₹12,550' },
  ];
  safeHTML('accountStats', stats.map(s => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 13px;background:var(--ivory);border-radius:8px;border:1px solid rgba(201,148,58,.1)">
      <span style="font-size:13px;color:var(--muted)">${s.label}</span>
      <span style="font-size:13.5px;font-weight:500;color:var(--soil)">${s.val}</span>
    </div>`).join(''));
}

async function saveProfile() {
  const name     = (document.getElementById('pName')?.value     || '').trim();
  const email    = (document.getElementById('pEmail')?.value    || '').trim();
  const phone    = (document.getElementById('pPhone')?.value    || '').trim();
  const location = (document.getElementById('pLocation')?.value || '').trim();
  const bio      = (document.getElementById('pBio')?.value      || '').trim();

  if (name) {
    /* ✅ Update session using auth.js key — no manual localStorage */
    try { localStorage.setItem('nesaName', name); } catch (_) {}
    safeSetText('sidebarName', name);
    safeSetText('profileName', name);
    updateGreeting(name);
  }

  try {
    await apiFetch('/api/customer/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, email, phone, location, bio })
    });
  } catch (_) { /* offline */ }

  showToast('Profile saved successfully!');
}

/* ════════════════════════════════════════
   LOGOUT  (delegates to auth.js)
════════════════════════════════════════ */
function doLogout() {
  showToast('Logging out…');
  setTimeout(() => logout(), 1000);   /* logout() is from auth.js */
}

/* ════════════════════════════════════════
   TOAST
════════════════════════════════════════ */
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  const icon  = toast ? toast.querySelector('svg') : null;
  const label = document.getElementById('toastMsg');
  if (!toast || !label) return;
  label.textContent = msg;
  if (icon) {
    icon.style.color = isError ? '#c0392b' : '#6b8f6e';
    icon.innerHTML   = isError
      ? '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
      : '<polyline points="20 6 9 17 4 12"/>';
  }
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}