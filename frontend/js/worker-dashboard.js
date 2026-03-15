/* ═══════════════════════════════════════════
   NESAMANI — worker-dashboard.js
   Requires: auth.js (loaded before this file)
   Spring Boot API base: http://localhost:8080
   ═══════════════════════════════════════════ */

const API = 'http://localhost:8080';

/* ════════════════════════════════════════════
   MOCK DATA  (replace fetch calls with real API)
════════════════════════════════════════════ */
const AVAIL_JOBS = [
  { id:1,  icon:'🔧', category:'Plumbing',   title:'Fix kitchen sink pipe', location:'Trichy',     pay:'₹600–₹900',  payType:'per visit',  desc:'Pipe under the kitchen sink is leaking badly. Need urgent fix.', tags:['Urgent','Pipe Fitting'], poster:'Priya N.' },
  { id:2,  icon:'⚡', category:'Electrical', title:'Install 3 ceiling fans', location:'Madurai',   pay:'₹1,200',      payType:'fixed',      desc:'Need ceiling fans installed in 3 rooms. Wiring points already present.', tags:['Indoor','Fan Wiring'], poster:'Karthik R.' },
  { id:3,  icon:'🎨', category:'Painting',   title:'Paint 2BHK interior',   location:'Coimbatore', pay:'₹8,000',      payType:'project',    desc:'Full interior painting for a 2-bedroom flat. Walls only, no furniture.', tags:['3-day work','Interior'], poster:'Anitha S.' },
  { id:4,  icon:'🚗', category:'Driving',    title:'Daily office commute driver', location:'Chennai', pay:'₹700',    payType:'per day',    desc:'Need a driver for 6 AM–9 AM and 6 PM–9 PM daily. Monday to Saturday.', tags:['Daily','Morning+Evening'], poster:'Rajesh M.' },
  { id:5,  icon:'🏠', category:'Maid',       title:'Part-time maid 4 hrs/day', location:'Trichy', pay:'₹5,000',    payType:'per month',  desc:'Morning cleaning, vessel washing, and basic cooking. 6 days a week.', tags:['Part-time','Cooking'], poster:'Meena T.' },
  { id:6,  icon:'🪵', category:'Carpentry',  title:'Build custom wardrobe',  location:'Salem',     pay:'₹12,000',    payType:'project',    desc:'Need a full-wall sliding wardrobe for master bedroom. Size: 8×7 ft.', tags:['Custom','Woodwork'], poster:'Suresh K.' },
  { id:7,  icon:'🔧', category:'Plumbing',   title:'Bathroom renovation plumbing', location:'Erode', pay:'₹4,500', payType:'project',    desc:'New bathroom tiling done. Need plumbing setup for new fixtures.', tags:['Renovation','New Setup'], poster:'Kavitha V.' },
  { id:8,  icon:'⚡', category:'Electrical', title:'Solar panel wiring check', location:'Madurai', pay:'₹1,800',   payType:'fixed',      desc:'Existing solar panels need wiring inspection and minor repairs.', tags:['Solar','Inspection'], poster:'Bala P.' },
];

const MY_APPLICATIONS = [
  { id:1, icon:'🔧', title:'Fix kitchen sink pipe',    customer:'Priya N.',   location:'Trichy',     date:'12 Mar 2026', status:'accepted',  amount:'₹750' },
  { id:2, icon:'⚡', title:'Install 3 ceiling fans',   customer:'Karthik R.', location:'Madurai',    date:'10 Mar 2026', status:'applied',   amount:'₹1,200' },
  { id:3, icon:'🎨', title:'Paint 2BHK interior',      customer:'Anitha S.',  location:'Coimbatore', date:'08 Mar 2026', status:'completed', amount:'₹8,000' },
  { id:4, icon:'🚗', title:'Daily office commute',     customer:'Rajesh M.',  location:'Chennai',    date:'05 Mar 2026', status:'rejected',  amount:'₹700/day' },
  { id:5, icon:'🏠', title:'Part-time maid 4 hrs/day', customer:'Meena T.',   location:'Trichy',     date:'01 Mar 2026', status:'applied',   amount:'₹5,000' },
  { id:6, icon:'🪵', title:'Custom wardrobe build',    customer:'Suresh K.',  location:'Salem',      date:'26 Feb 2026', status:'completed', amount:'₹12,000' },
];

const W_MESSAGES = [
  { avatar:'🏠', name:'Meena T.', role:'Customer · Trichy', preview:'Can you start Monday?', unread:true,
    chat:[
      { from:'them', text:'Hi, I saw your application for the part-time maid role.', time:'10:00 AM' },
      { from:'me',   text:'Yes, I am available and experienced in that kind of work.', time:'10:05 AM' },
      { from:'them', text:'Can you start Monday? 6 AM to 10 AM shift.', time:'10:08 AM' },
    ]
  },
  { avatar:'🔧', name:'Priya N.', role:'Customer · Trichy', preview:'Great, see you tomorrow!', unread:true,
    chat:[
      { from:'them', text:'Your application was accepted for the pipe fixing job.', time:'Yesterday' },
      { from:'me',   text:'Thank you! I will bring all necessary tools.', time:'Yesterday' },
      { from:'them', text:'Great, see you tomorrow at 10 AM.', time:'Yesterday' },
    ]
  },
  { avatar:'⚡', name:'Karthik R.', role:'Customer · Madurai', preview:'What time works for you?', unread:false,
    chat:[
      { from:'them', text:'I need 3 ceiling fans installed. Are you available this weekend?', time:'2 days ago' },
      { from:'me',   text:'Yes, Saturday works. I can be there by 9 AM.', time:'2 days ago' },
      { from:'them', text:'What time works for you?', time:'2 days ago' },
    ]
  },
];

const W_NOTIFICATIONS = [
  { id:1, icon:'✅', msg:'Your application for <strong>Fix kitchen sink pipe</strong> was accepted!', time:'5 mins ago', read:false },
  { id:2, icon:'💬', msg:'<strong>Meena T.</strong> sent you a message about the maid job.', time:'1 hr ago', read:false },
  { id:3, icon:'⭐', msg:'You received a 5-star review from Anitha S. for the painting job.', time:'3 hrs ago', read:false },
  { id:4, icon:'💰', msg:'Payment of ₹8,000 received for the 2BHK painting project.', time:'Yesterday', read:false },
  { id:5, icon:'📋', msg:'2 new jobs posted near you in Trichy.', time:'2 days ago', read:true },
  { id:6, icon:'👁️', msg:'Your profile was viewed 8 times this week.', time:'3 days ago', read:true },
];

const W_EARNINGS = [
  {month:'Sep',val:2100},{month:'Oct',val:2800},{month:'Nov',val:1900},
  {month:'Dec',val:3400},{month:'Jan',val:2600},{month:'Feb',val:3100},{month:'Mar',val:3200}
];

let wSkills        = ['Pipe Fitting','Drainage','Solar Water','Bathroom Fix','Leak Repair'];
let wActiveThread  = 0;
let wAvailable     = true;
let wCurrentNavId  = 'overview';

/* ════════════════════════════════════════════
   INIT
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  /* Auth guard — only workers allowed */
  if (!requireAuth('worker')) return;

  populateUserInfo();
  updateGreeting();
  renderWStats();
  renderRecentApps();
  renderWQA();
  renderMiniNotifs();
  renderAvailJobs();
  renderAllApps('all');
  renderWMsgThreads();
  renderWChat(0);
  renderWEarnings();
  renderWPayments();
  renderWNotifications();
  renderWProfile();
  renderWSkills();
  renderWAccStats();
});

/* ════════════════════════════════════════════
   USER INFO FROM SESSION
════════════════════════════════════════════ */
function populateUserInfo() {
  const name = getSession('name') || 'Worker';
  const el1  = document.getElementById('sName');
  const el2  = document.getElementById('pName');
  const el3  = document.getElementById('pFullName');
  const el4  = document.getElementById('pBigAvatar');
  if (el1) el1.textContent = name;
  if (el2) el2.textContent = name;
  if (el3) el3.value       = name;
  if (el4) el4.textContent = '👷';

  const email = getSession('email') || '';
  const pEmail = document.getElementById('pEmail');
  if (pEmail) pEmail.value = email;

  const pMeta = document.getElementById('pMeta');
  if (pMeta) pMeta.innerHTML = `
    <span class="p-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="12" height="12"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Tamil Nadu</span>
    <span class="p-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="12" height="12"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>4.9 Rating</span>
    <span class="p-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="12" height="12"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>342 Jobs Done</span>`;
}

/* ════════════════════════════════════════════
   NAVIGATION
════════════════════════════════════════════ */
const PAGE_TITLES = {
  overview:'Overview', browse:'Browse Jobs', applications:'My Applications',
  messages:'Messages', earnings:'Earnings', notifications:'Notifications', profile:'My Profile'
};

function navigate(page) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.s-item').forEach(n => n.classList.remove('active'));
  const sec = document.getElementById('sec-' + page);
  if (sec) sec.classList.add('active');
  const nav = document.getElementById('nav-' + page);
  if (nav) nav.classList.add('active');
  const pt = document.getElementById('pageTitle');
  if (pt) pt.textContent = PAGE_TITLES[page] || '';
  wCurrentNavId = page;
  document.getElementById('sidebar').classList.remove('open');
}

/* ════════════════════════════════════════════
   GREETING
════════════════════════════════════════════ */
function updateGreeting() {
  const h = new Date().getHours();
  const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const name = (getSession('name') || 'there').split(' ')[0];
  const el = document.getElementById('greetText');
  if (el) el.textContent = `${g}, ${name} 👋`;
}

/* ════════════════════════════════════════════
   AVAILABILITY TOGGLE
════════════════════════════════════════════ */
function toggleAvailability() {
  wAvailable = !wAvailable;
  const dot   = document.getElementById('availDot');
  const label = document.getElementById('availLabel');
  if (dot)   dot.className   = 't-avail-dot' + (wAvailable ? '' : ' busy');
  if (label) label.textContent = wAvailable ? 'Available' : 'Busy';
  showToast(wAvailable ? 'You are now available for jobs' : 'You are now set to Busy');
}

/* ════════════════════════════════════════════
   STATS
════════════════════════════════════════════ */
function renderWStats() {
  const stats = [
    { icon:'💼', cls:'si-green', val:'342',     lbl:'Jobs Done',     delta:'delta-up',   text:'+8 this month',  arrow:'up' },
    { icon:'⭐', cls:'si-gold',  val:'4.9',     lbl:'Avg Rating',    delta:'delta-up',   text:'+0.1 this month',arrow:'up' },
    { icon:'💰', cls:'si-earth', val:'₹18,400', lbl:'Total Earned',  delta:'delta-up',   text:'+₹3,200 month',  arrow:'up' },
    { icon:'📨', cls:'si-sage',  val:'3',        lbl:'Active Apps',   delta:'delta-warn', text:'2 awaiting reply',arrow:'none'},
  ];
  const el = document.getElementById('wStatsRow');
  if (!el) return;
  el.innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-icon ${s.cls}">${s.icon}</div>
      <div class="stat-num">${s.val}</div>
      <div class="stat-lbl">${s.lbl}</div>
      <div class="stat-delta ${s.delta}">
        ${s.arrow !== 'none' ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="${s.arrow==='up'?'18 15 12 9 6 15':'6 9 12 15 18 9'}"/></svg>` : ''}
        ${s.text}
      </div>
    </div>`).join('');
}

/* ════════════════════════════════════════════
   APPLICATIONS (recent + all)
════════════════════════════════════════════ */
function appRowHTML(a) {
  const statusMap = { accepted:'st-active', applied:'st-pending', completed:'st-completed', rejected:'st-cancelled' };
  return `
  <div class="job-row">
    <div class="job-icon-wrap">${a.icon}</div>
    <div class="job-info">
      <div class="job-title">${a.title}</div>
      <div class="job-meta">
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>${a.customer}</span>
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${a.location}</span>
        <span>${a.date}</span>
      </div>
    </div>
    <span class="job-status ${statusMap[a.status]||'st-pending'}">${a.status}</span>
    <span class="job-amount">${a.amount}</span>
  </div>`;
}

function renderRecentApps() {
  const el = document.getElementById('recentAppsPanel');
  if (el) el.innerHTML = MY_APPLICATIONS.slice(0,4).map(appRowHTML).join('');
}

function renderAllApps(filter) {
  const el = document.getElementById('allAppsPanel');
  if (!el) return;
  const data = filter === 'all' ? MY_APPLICATIONS : MY_APPLICATIONS.filter(a => a.status === filter);
  el.innerHTML = data.length ? data.map(appRowHTML).join('') :
    `<div style="padding:44px;text-align:center;color:var(--muted);font-size:14px">No applications found.</div>`;
}

function filterApps(btn) {
  document.querySelectorAll('#appFilterTabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAllApps(btn.dataset.f);
}

/* ════════════════════════════════════════════
   QUICK ACTIONS
════════════════════════════════════════════ */
function renderWQA() {
  const el = document.getElementById('wQAPanel');
  if (!el) return;
  const actions = [
    { icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="20" height="20"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`, label:'Browse Jobs', fn:"navigate('browse')" },
    { icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="20" height="20"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`, label:'Edit Profile', fn:"navigate('profile')" },
    { icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="20" height="20"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`, label:'Messages', fn:"navigate('messages')" },
    { icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="20" height="20"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`, label:'Earnings', fn:"navigate('earnings')" },
  ];
  el.innerHTML = actions.map(a => `
    <div class="qa-item" onclick="${a.fn}">${a.icon}<span>${a.label}</span></div>`).join('');
}

/* ════════════════════════════════════════════
   AVAILABLE JOBS
════════════════════════════════════════════ */
function renderAvailJobs(data) {
  const el = document.getElementById('availJobsGrid');
  if (!el) return;
  const jobs = data || AVAIL_JOBS;
  if (!jobs.length) {
    el.innerHTML = `<div style="padding:60px;text-align:center;color:var(--muted)">No jobs found matching your criteria.</div>`;
    return;
  }
  el.innerHTML = jobs.map((j,i) => `
    <div class="avail-card" style="animation-delay:${i*.05}s;animation:fadeUp .4s ease both">
      <div class="ac-top">
        <div class="ac-cat">
          <div class="ac-icon">${j.icon}</div>
          <div>
            <div class="ac-cat-name">${j.category}</div>
            <div class="ac-loc">📍 ${j.location}</div>
          </div>
        </div>
        <div class="ac-pay">
          <div class="ac-pay-val">${j.pay}</div>
          <div class="ac-pay-type">${j.payType}</div>
        </div>
      </div>
      <p class="ac-desc">${j.desc}</p>
      <div class="ac-tags">${j.tags.map(t=>`<span class="ac-tag">${t}</span>`).join('')}</div>
      <div class="ac-footer">
        <span class="ac-poster"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="12" height="12"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>${j.poster}</span>
        <button class="btn-apply" onclick="applyJob(${j.id})">Apply Now →</button>
      </div>
    </div>`).join('');
}

function filterAvailJobs() {
  const q   = (document.getElementById('jobSearchInput')?.value || '').toLowerCase();
  const cat = (document.getElementById('catFilter')?.value || '').toLowerCase();
  const filtered = AVAIL_JOBS.filter(j => {
    const matchQ   = !q   || j.title.toLowerCase().includes(q) || j.location.toLowerCase().includes(q) || j.category.toLowerCase().includes(q);
    const matchCat = !cat || j.category.toLowerCase().includes(cat);
    return matchQ && matchCat;
  });
  renderAvailJobs(filtered);
}

function applyJob(id) {
  const j = AVAIL_JOBS.find(x => x.id === id);
  if (!j) return;
  showToast(`Applied to "${j.title}" successfully!`);
}

/* ════════════════════════════════════════════
   MESSAGES
════════════════════════════════════════════ */
function renderWMsgThreads() {
  const el = document.getElementById('wMsgThreads');
  if (!el) return;
  el.innerHTML = W_MESSAGES.map((m,i) => `
    <div class="msg-thread ${i===wActiveThread?'active':''}" onclick="renderWChat(${i})">
      <div class="msg-avatar">${m.avatar}</div>
      <div class="msg-t-info">
        <div class="msg-t-name">${m.name}</div>
        <div class="msg-t-prev">${m.preview}</div>
      </div>
      ${m.unread ? '<div class="msg-unread-dot"></div>' : ''}
    </div>`).join('');
}

function renderWChat(idx) {
  wActiveThread = idx;
  const m = W_MESSAGES[idx];
  if (!m) return;
  const av = document.getElementById('wChatAvatar');
  const nm = document.getElementById('wChatName');
  const rl = document.getElementById('wChatRole');
  const bb = document.getElementById('wChatBubbles');
  if (av) av.textContent = m.avatar;
  if (nm) nm.textContent = m.name;
  if (rl) rl.textContent = m.role;
  if (bb) {
    bb.innerHTML = m.chat.map(c => `
      <div class="bubble ${c.from==='me'?'sent':'recv'}">
        <div class="bubble-text">${c.text}</div>
        <div class="bubble-time">${c.time}</div>
      </div>`).join('');
    bb.scrollTop = 99999;
  }
  m.unread = false;
  renderWMsgThreads();
}

function wSendMsg() {
  const input = document.getElementById('wMsgInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  const now = new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
  W_MESSAGES[wActiveThread].chat.push({ from:'me', text, time: now });
  W_MESSAGES[wActiveThread].preview = text;
  input.value = '';
  renderWChat(wActiveThread);
}

/* ════════════════════════════════════════════
   EARNINGS
════════════════════════════════════════════ */
function renderWEarnings() {
  const el = document.getElementById('wEarningsChart');
  if (!el) return;
  const max = Math.max(...W_EARNINGS.map(d => d.val));
  el.innerHTML = W_EARNINGS.map(d => `
    <div class="bar-col" style="flex:1">
      <div class="bar" style="height:${Math.round(d.val/max*100)}px" data-val="₹${d.val.toLocaleString('en-IN')}"></div>
      <div class="bar-lbl">${d.month}</div>
    </div>`).join('');
}

function renderWPayments() {
  const el = document.getElementById('wPaymentHistory');
  if (!el) return;
  const payments = [
    { icon:'🎨', name:'2BHK Painting — Anitha S.',  amount:'+₹8,000', date:'08 Mar', color:'var(--sage)' },
    { icon:'🪵', name:'Wardrobe — Suresh K.',        amount:'+₹12,000',date:'26 Feb', color:'var(--sage)' },
    { icon:'🔧', name:'Pipe Fix — Priya N.',         amount:'Pending', date:'12 Mar', color:'var(--warning)' },
  ];
  el.innerHTML = payments.map(p => `
    <div class="job-row">
      <div class="job-icon-wrap">${p.icon}</div>
      <div class="job-info"><div class="job-title" style="font-size:13px">${p.name}</div><div class="job-meta">${p.date}</div></div>
      <span style="font-size:13.5px;font-weight:600;color:${p.color}">${p.amount}</span>
    </div>`).join('');
}

/* ════════════════════════════════════════════
   NOTIFICATIONS
════════════════════════════════════════════ */
function renderMiniNotifs() {
  const el = document.getElementById('miniNotifPanel');
  if (!el) return;
  el.innerHTML = W_NOTIFICATIONS.slice(0,3).map(n => `
    <div class="notif-row ${n.read?'':'unread'}" onclick="wMarkRead(${n.id})">
      ${!n.read ? '<div class="notif-ind"></div>' : '<div style="width:7px"></div>'}
      <div class="notif-icon-wrap">${n.icon}</div>
      <div><div class="notif-msg">${n.msg}</div><div class="notif-time">${n.time}</div></div>
    </div>`).join('');
}

function renderWNotifications() {
  const el = document.getElementById('wAllNotifs');
  if (!el) return;
  el.innerHTML = W_NOTIFICATIONS.map(n => `
    <div class="notif-row ${n.read?'':'unread'}" onclick="wMarkRead(${n.id})">
      ${!n.read ? '<div class="notif-ind"></div>' : '<div style="width:7px"></div>'}
      <div class="notif-icon-wrap">${n.icon}</div>
      <div><div class="notif-msg">${n.msg}</div><div class="notif-time">${n.time}</div></div>
    </div>`).join('');
  const cnt = document.getElementById('notifCount');
  const unread = W_NOTIFICATIONS.filter(n=>!n.read).length;
  if (cnt) cnt.textContent = unread > 0 ? unread : '';
}

function wMarkRead(id) {
  const n = W_NOTIFICATIONS.find(x=>x.id===id);
  if (n) n.read = true;
  renderWNotifications();
  renderMiniNotifs();
}

function wMarkAllRead() {
  W_NOTIFICATIONS.forEach(n => n.read = true);
  renderWNotifications();
  renderMiniNotifs();
  showToast('All notifications marked as read');
}

/* ════════════════════════════════════════════
   PROFILE
════════════════════════════════════════════ */
function renderWProfile() {
  const name  = getSession('name')  || '';
  const email = getSession('email') || '';
  const el = document.getElementById('pFullName');
  if (el) el.value = name;
  const el2 = document.getElementById('pEmail');
  if (el2) el2.value = email;
  const bio = document.getElementById('pBio');
  if (bio) bio.value = 'Experienced professional with hands-on skills. Known for punctuality and fair pricing.';
  const loc = document.getElementById('pLocation');
  if (loc) loc.value = 'Trichy, Tamil Nadu';
  const phone = document.getElementById('pPhone');
  if (phone) phone.value = '+91 98765 43210';
}

function renderWSkills() {
  const el = document.getElementById('wSkillsBox');
  if (!el) return;
  el.innerHTML = wSkills.map((s,i) => `
    <div class="skill-chip">${s}<button onclick="wRemoveSkill(${i})">×</button></div>`).join('');
}

function wAddSkill() {
  const input = document.getElementById('wSkillInput');
  if (!input) return;
  const val = input.value.trim();
  if (!val || wSkills.includes(val)) { input.value=''; return; }
  wSkills.push(val);
  input.value = '';
  renderWSkills();
  showToast(`"${val}" added`);
}

function wRemoveSkill(i) {
  wSkills.splice(i,1);
  renderWSkills();
}

function renderWAccStats() {
  const el = document.getElementById('wAccStats');
  if (!el) return;
  const stats = [
    ['Member Since','January 2025'],['Jobs Completed','342'],
    ['Avg Rating','4.9 ★'],['Response Rate','98%'],['Profile Views','1,240'],
  ];
  el.innerHTML = stats.map(([l,v]) => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 13px;background:var(--ivory);border-radius:8px;border:1px solid rgba(201,148,58,.1)">
      <span style="font-size:13px;color:var(--muted)">${l}</span>
      <span style="font-size:13.5px;font-weight:500;color:var(--soil)">${v}</span>
    </div>`).join('');
}

function wSaveProfile() {
  const nameEl = document.getElementById('pFullName');
  if (nameEl && nameEl.value.trim()) {
    try { localStorage.setItem('nesaName', nameEl.value.trim()); } catch(e){}
    const sName = document.getElementById('sName');
    if (sName) sName.textContent = nameEl.value.trim();
    const pName = document.getElementById('pName');
    if (pName) pName.textContent = nameEl.value.trim();
  }
  showToast('Profile saved successfully!');
}

/* TOAST */
function showToast(msg) {
  const t  = document.getElementById('toast');
  const sp = document.getElementById('toastMsg');
  if (!t || !sp) return;
  sp.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}