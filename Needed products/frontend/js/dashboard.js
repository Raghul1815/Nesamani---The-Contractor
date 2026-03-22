  /* ════════════════════════════════════════
     DATA
  ════════════════════════════════════════ */
  const USER = {
    name: 'Ravi Kumar', role: 'worker',
    avatar: '🔧', location: 'Trichy'
  };

  const JOBS = [
    { id:1, title:'Fix kitchen pipe leak', worker:'Murugan Selvam', icon:'🔧', category:'Plumber', date:'12 Mar 2026', status:'completed', amount:'₹850' },
    { id:2, title:'Rewire living room switches', worker:'Lakshmi Rajan', icon:'⚡', category:'Electrician', date:'10 Mar 2026', status:'active', amount:'₹1,200' },
    { id:3, title:'Interior wall painting', worker:'Rajan Annamalai', icon:'🎨', category:'Painter', date:'08 Mar 2026', status:'pending', amount:'₹4,500' },
    { id:4, title:'Airport pickup & drop', worker:'Senthil Kumar', icon:'🚗', category:'Driver', date:'05 Mar 2026', status:'completed', amount:'₹600' },
    { id:5, title:'Weekly home cleaning', worker:'Geetha Devi', icon:'🏠', category:'Maid', date:'01 Mar 2026', status:'active', amount:'₹1,800' },
    { id:6, title:'Custom bookshelf build', worker:'Pandi Raj', icon:'🪵', category:'Carpenter', date:'26 Feb 2026', status:'completed', amount:'₹3,200' },
    { id:7, title:'Garden layout & plants', worker:'Malar Vizhi', icon:'🌿', category:'Gardener', date:'20 Feb 2026', status:'cancelled', amount:'₹1,500' },
    { id:8, title:'Daily cooking — breakfast', worker:'Chitra Priya', icon:'🍳', category:'Cook', date:'15 Feb 2026', status:'completed', amount:'₹2,400' },
  ];

  const NOTIFICATIONS = [
    { id:1, icon:'✅', msg:'Your job with <strong>Murugan Selvam</strong> has been marked complete.', time:'2 mins ago', read:false },
    { id:2, icon:'💬', msg:'<strong>Lakshmi Rajan</strong> sent you a message about the wiring job.', time:'1 hr ago', read:false },
    { id:3, icon:'⭐', msg:'You received a new 5-star review from Priya N.', time:'3 hrs ago', read:false },
    { id:4, icon:'🔔', msg:'<strong>Geetha Devi</strong> accepted your cleaning request for next week.', time:'Yesterday', read:false },
    { id:5, icon:'💰', msg:'Payment of ₹850 received for pipe repair job.', time:'2 days ago', read:true },
    { id:6, icon:'📋', msg:'Your profile was viewed 12 times this week.', time:'3 days ago', read:true },
  ];

  const WORKERS_SAMPLE = [
    { name:'Murugan Selvam', role:'Plumber · Trichy', icon:'🔧', rating:'4.9', availability:'available' },
    { name:'Lakshmi Rajan', role:'Electrician · Madurai', icon:'⚡', rating:'4.8', availability:'available' },
    { name:'Rajan Annamalai', role:'Painter · Coimbatore', icon:'🎨', rating:'4.7', availability:'busy' },
    { name:'Senthil Kumar', role:'Driver · Chennai', icon:'🚗', rating:'4.9', availability:'available' },
    { name:'Geetha Devi', role:'Maid · Trichy', icon:'🏠', rating:'4.8', availability:'available' },
    { name:'Pandi Raj', role:'Carpenter · Salem', icon:'🪵', rating:'4.6', availability:'available' },
    { name:'Malar Vizhi', role:'Gardener · Erode', icon:'🌿', rating:'4.7', availability:'busy' },
    { name:'Chitra Priya', role:'Cook · Madurai', icon:'🍳', rating:'4.9', availability:'available' },
  ];

  const MESSAGES = [
    { avatar:'🔧', name:'Murugan Selvam', role:'Plumber · Trichy', preview:'I can come tomorrow morning', unread:true,
      chat:[
        { from:'them', text:'Hello! I saw your request for pipe fixing.', time:'10:02 AM' },
        { from:'me',   text:'Yes, it is leaking near the kitchen sink. Can you come today?', time:'10:05 AM' },
        { from:'them', text:'Sorry, I am fully booked today. I can come tomorrow morning around 9 AM.', time:'10:07 AM' },
        { from:'me',   text:'That works. Please confirm before coming.', time:'10:09 AM' },
        { from:'them', text:'Sure, I will call you at 8:30 AM. Approximate cost will be ₹600–₹900.', time:'10:10 AM' },
      ]
    },
    { avatar:'⚡', name:'Lakshmi Rajan', role:'Electrician · Madurai', preview:'The wiring is done!', unread:true,
      chat:[
        { from:'me',   text:'Hi Lakshmi, can you check our living room wiring?', time:'Yesterday' },
        { from:'them', text:'Yes, I will assess and give a quote. When are you free?', time:'Yesterday' },
        { from:'me',   text:'This Saturday works.', time:'Yesterday' },
        { from:'them', text:'The wiring is done! Everything is safe and tested.', time:'Today 9:00 AM' },
      ]
    },
    { avatar:'🍳', name:'Chitra Priya', role:'Cook · Madurai', preview:'Menu for tomorrow…', unread:false,
      chat:[
        { from:'them', text:'Good morning! What would you like for tomorrow\'s breakfast menu?', time:'8:00 AM' },
        { from:'me',   text:'Idly, sambar, and coconut chutney please.', time:'8:15 AM' },
        { from:'them', text:'Of course! I will have everything ready by 7:30 AM.', time:'8:17 AM' },
      ]
    },
  ];

  const EARNINGS_DATA = [
    { month:'Sep', val:2100 }, { month:'Oct', val:2800 }, { month:'Nov', val:1900 },
    { month:'Dec', val:3400 }, { month:'Jan', val:2600 }, { month:'Feb', val:3100 },
    { month:'Mar', val:3200 },
  ];

  let SKILLS = ['Pipe Fitting','Drainage','Solar Water','Bathroom Fix','Leak Repair'];
  let currentRole = 'worker';
  let activeThread = 0;
  let currentJobFilter = 'all';

  /* ════════════════════════════════════════
     INIT
  ════════════════════════════════════════ */
  window.addEventListener('DOMContentLoaded', () => {
    updateGreeting();
    renderStats();
    renderRecentJobs();
    renderQuickActions();
    renderMiniNotifs();
    renderAllJobs();
    renderDashWorkers();
    renderMsgThreads();
    renderChat(0);
    renderEarningsChart();
    renderPaymentHistory();
    renderNotifications();
    renderProfileSkills();
    renderProfileStats();
    updateSidebarUser();
  });

  /* ════════════════════════════════════════
     NAVIGATION
  ════════════════════════════════════════ */
  const PAGE_TITLES = {
    overview:'Overview', jobs:'My Jobs', find:'Find Workers',
    messages:'Messages', earnings:'Earnings', notifications:'Notifications', profile:'Profile'
  };

  function navigate(page) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('sec-' + page).classList.add('active');
    const navEl = document.getElementById('nav-' + page);
    if (navEl) navEl.classList.add('active');
    document.getElementById('pageTitle').textContent = PAGE_TITLES[page] || '';
    // close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');
  }

  function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
  }

  /* ════════════════════════════════════════
     GREETING
  ════════════════════════════════════════ */
  function updateGreeting() {
    const h = new Date().getHours();
    const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    const firstName = USER.name.split(' ')[0];
    document.getElementById('greetingText').textContent = `${greet}, ${firstName} 👋`;
    document.getElementById('sidebarName').textContent = USER.name;
    document.getElementById('sidebarAvatar').textContent = USER.avatar;
    document.getElementById('profileName').textContent = USER.name;
  }

  /* ════════════════════════════════════════
     ROLE SWITCH
  ════════════════════════════════════════ */
  function switchRole(role) {
    currentRole = role;
    document.getElementById('roleWorker').classList.toggle('active', role === 'worker');
    document.getElementById('roleCustomer').classList.toggle('active', role === 'customer');
    document.getElementById('sidebarRole').textContent = role === 'worker' ? 'Worker' : 'Customer';
    document.getElementById('profileRoleText').textContent = (role === 'worker' ? 'Worker' : 'Customer') + ' · Joined Jan 2025';
    renderStats();
    renderQuickActions();
    showToast(`Switched to ${role === 'worker' ? 'Worker' : 'Customer'} view`);
  }

  /* ════════════════════════════════════════
     STATS
  ════════════════════════════════════════ */
  function renderStats() {
    const isWorker = currentRole === 'worker';
    const stats = isWorker
      ? [
          { icon:'💼', cls:'gold',  val:'342',     key:'Jobs Done',      delta:'up',   text:'+8 this month' },
          { icon:'⭐', cls:'sage',  val:'4.9',     key:'Avg Rating',     delta:'up',   text:'+0.1 this month' },
          { icon:'💰', cls:'earth', val:'₹18,400', key:'Total Earned',   delta:'up',   text:'+₹3,200 this month' },
          { icon:'👁️', cls:'clay',  val:'1,240',   key:'Profile Views',  delta:'up',   text:'+120 this week' },
        ]
      : [
          { icon:'📋', cls:'gold',  val:'8',       key:'Jobs Posted',    delta:'up',   text:'+2 this month' },
          { icon:'✅', cls:'sage',  val:'6',       key:'Completed',      delta:'up',   text:'75% completion' },
          { icon:'💰', cls:'earth', val:'₹12,550', key:'Total Spent',    delta:'down', text:'+₹2,400 this month' },
          { icon:'⭐', cls:'clay',  val:'4.8',     key:'Avg Review',     delta:'up',   text:'You left 5 reviews' },
        ];

    document.getElementById('statsGrid').innerHTML = stats.map(s => `
      <div class="stat-card">
        <div class="stat-card-icon ${s.cls}">${s.icon}</div>
        <div class="stat-val">${s.val}</div>
        <div class="stat-key">${s.key}</div>
        <div class="stat-delta ${s.delta}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${s.delta === 'up' ? '<polyline points="18 15 12 9 6 15"/>' : '<polyline points="6 9 12 15 18 9"/>'}
          </svg>
          ${s.text}
        </div>
      </div>`).join('');
  }

  /* ════════════════════════════════════════
     RECENT JOBS (overview panel)
  ════════════════════════════════════════ */
  function renderRecentJobs() {
    document.getElementById('recentJobsPanel').innerHTML =
      JOBS.slice(0,5).map(j => jobRowHTML(j)).join('');
  }

  function jobRowHTML(j) {
    return `
    <div class="job-row" onclick="navigate('jobs')">
      <div class="job-icon">${j.icon}</div>
      <div class="job-details">
        <div class="job-title">${j.title}</div>
        <div class="job-meta">
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>${j.worker}</span>
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${j.date}</span>
        </div>
      </div>
      <span class="job-status ${j.status}">${j.status}</span>
      <span class="job-date" style="font-weight:500;color:var(--soil)">${j.amount}</span>
    </div>`;
  }

  /* ════════════════════════════════════════
     ALL JOBS (jobs section)
  ════════════════════════════════════════ */
  function renderAllJobs(filter = 'all') {
    const filtered = filter === 'all' ? JOBS : JOBS.filter(j => j.status === filter);
    document.getElementById('allJobsPanel').innerHTML = filtered.length
      ? filtered.map(j => jobRowHTML(j)).join('')
      : `<div style="padding:48px;text-align:center;color:var(--muted);font-size:14px">No jobs found for this filter.</div>`;
  }

  function filterJobs(btn) {
    document.querySelectorAll('#jobFilterTabs .sort-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderAllJobs(btn.dataset.filter);
  }

  /* ════════════════════════════════════════
     QUICK ACTIONS
  ════════════════════════════════════════ */
  function renderQuickActions() {
    const isWorker = currentRole === 'worker';
    const actions = isWorker
      ? [
          { icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`, label:'Edit Profile',  href:'#', fn:"navigate('profile')" },
          { icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`, label:'Find Jobs', href:'find-job.html', fn:'' },
          { icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`, label:'Messages',   href:'#', fn:"navigate('messages')" },
          { icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`, label:'Earnings', href:'#', fn:"navigate('earnings')" },
        ]
      : [
          { icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`, label:'Find Worker', href:'find-job.html', fn:'' },
          { icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>`, label:'Post a Job', href:'#', fn:"showToast('Feature coming soon!')" },
          { icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`, label:'Messages', href:'#', fn:"navigate('messages')" },
          { icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 1.24l3-.12a2 2 0 0 1 2 1.72 17.8 17.8 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6"/></svg>`, label:'Support', href:'#', fn:"showToast('Support chat coming soon!')" },
        ];

    document.getElementById('quickActionsPanel').innerHTML = actions.map(a => `
      <a class="qa-btn" href="${a.href}" onclick="${a.fn ? a.fn + ';return false' : ''}">
        ${a.icon}
        <span class="qa-label">${a.label}</span>
      </a>`).join('');
  }

  /* ════════════════════════════════════════
     MINI NOTIFICATIONS
  ════════════════════════════════════════ */
  function renderMiniNotifs() {
    document.getElementById('miniNotifPanel').innerHTML =
      NOTIFICATIONS.slice(0,3).map(n => `
      <div class="notif-row ${n.read ? '' : 'unread'}">
        <div class="notif-dot-wrap">${!n.read ? '<div class="notif-dot-ind"></div>' : ''}</div>
        <div class="notif-icon">${n.icon}</div>
        <div class="notif-text">
          <div class="notif-msg">${n.msg}</div>
          <div class="notif-time">${n.time}</div>
        </div>
      </div>`).join('');
  }

  /* ════════════════════════════════════════
     ALL NOTIFICATIONS
  ════════════════════════════════════════ */
  function renderNotifications() {
    document.getElementById('allNotifPanel').innerHTML =
      NOTIFICATIONS.map(n => `
      <div class="notif-row ${n.read ? '' : 'unread'}" onclick="markRead(${n.id})">
        <div class="notif-dot-wrap">${!n.read ? '<div class="notif-dot-ind"></div>' : ''}</div>
        <div class="notif-icon">${n.icon}</div>
        <div class="notif-text">
          <div class="notif-msg">${n.msg}</div>
          <div class="notif-time">${n.time}</div>
        </div>
      </div>`).join('');
  }

  function markRead(id) {
    const n = NOTIFICATIONS.find(x => x.id === id);
    if (n) n.read = true;
    renderNotifications();
    renderMiniNotifs();
  }

  function markAllRead() {
    NOTIFICATIONS.forEach(n => n.read = true);
    renderNotifications();
    renderMiniNotifs();
    showToast('All notifications marked as read');
  }

  /* ════════════════════════════════════════
     FIND WORKERS (dashboard section)
  ════════════════════════════════════════ */
  function renderDashWorkers(query = '') {
    const filtered = query
      ? WORKERS_SAMPLE.filter(w =>
          w.name.toLowerCase().includes(query) || w.role.toLowerCase().includes(query))
      : WORKERS_SAMPLE;

    document.getElementById('dashWorkers').innerHTML = filtered.map(w => `
      <div class="w-chip" onclick="showToast('Viewing ${w.name}…')">
        <div class="w-chip-avatar">
          ${w.icon}
          <div class="w-chip-dot ${w.availability}"></div>
        </div>
        <div class="w-chip-info">
          <div class="w-chip-name">${w.name}</div>
          <div class="w-chip-role">${w.role}</div>
          <div class="w-chip-rating">★ ${w.rating}</div>
        </div>
        <button onclick="event.stopPropagation();showToast('Contacting ${w.name}…')"
          style="padding:6px 12px;background:var(--soil);color:white;border:none;border-radius:7px;font-size:11.5px;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap">
          Hire →
        </button>
      </div>`).join('');
  }

  function filterDashWorkers() {
    renderDashWorkers(document.getElementById('dashSearchInput').value.trim().toLowerCase());
  }

  /* ════════════════════════════════════════
     MESSAGES
  ════════════════════════════════════════ */
  function renderMsgThreads() {
    document.getElementById('msgThreadList').innerHTML = MESSAGES.map((m, i) => `
      <div class="msg-thread ${i === activeThread ? 'active' : ''}" onclick="renderChat(${i})">
        <div class="msg-avatar">${m.avatar}</div>
        <div class="msg-thread-info">
          <div class="msg-thread-name">${m.name}</div>
          <div class="msg-thread-preview">${m.preview}</div>
        </div>
        ${m.unread ? '<div class="msg-unread"></div>' : ''}
      </div>`).join('');
  }

  function renderChat(idx) {
    activeThread = idx;
    const m = MESSAGES[idx];
    document.getElementById('chatAvatar').textContent = m.avatar;
    document.getElementById('chatName').textContent   = m.name;
    document.getElementById('chatRole').textContent   = m.role;
    document.getElementById('chatBubbles').innerHTML  = m.chat.map(c => `
      <div class="bubble ${c.from === 'me' ? 'sent' : 'recv'}">
        <div class="bubble-text">${c.text}</div>
        <div class="bubble-time">${c.time}</div>
      </div>`).join('');
    document.getElementById('chatBubbles').scrollTop = 99999;
    m.unread = false;
    renderMsgThreads();
  }

  function sendMsg() {
    const input = document.getElementById('msgInput');
    const text = input.value.trim();
    if (!text) return;
    MESSAGES[activeThread].chat.push({ from:'me', text, time: new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) });
    MESSAGES[activeThread].preview = text;
    input.value = '';
    renderChat(activeThread);
  }

  /* ════════════════════════════════════════
     EARNINGS CHART
  ════════════════════════════════════════ */
  function renderEarningsChart() {
    const max = Math.max(...EARNINGS_DATA.map(d => d.val));
    document.getElementById('earningsChart').innerHTML = EARNINGS_DATA.map(d => `
      <div class="bar-col" style="flex:1">
        <div class="bar" style="height:${Math.round(d.val/max*110)}px" data-val="₹${d.val.toLocaleString('en-IN')}"></div>
        <div class="bar-label">${d.month}</div>
      </div>`).join('');
  }

  function renderPaymentHistory() {
    const payments = [
      { icon:'🔧', name:'Pipe Repair — Murugan', amount:'+₹850', date:'12 Mar', color:'var(--sage)' },
      { icon:'🚗', name:'Airport Drop — Senthil', amount:'+₹600', date:'05 Mar', color:'var(--sage)' },
      { icon:'🪵', name:'Bookshelf — Pandi Raj',  amount:'+₹3,200', date:'26 Feb', color:'var(--sage)' },
      { icon:'🍳', name:'Daily Cook — Chitra',    amount:'+₹2,400', date:'15 Feb', color:'var(--sage)' },
      { icon:'⚡', name:'Wiring — Lakshmi',       amount:'Pending', date:'10 Mar', color:'var(--warning)' },
    ];
    document.getElementById('paymentHistory').innerHTML = payments.map(p => `
      <div class="job-row">
        <div class="job-icon">${p.icon}</div>
        <div class="job-details">
          <div class="job-title" style="font-size:13px">${p.name}</div>
          <div class="job-meta">${p.date}</div>
        </div>
        <span style="font-size:13.5px;font-weight:600;color:${p.color}">${p.amount}</span>
      </div>`).join('');
  }

  /* ════════════════════════════════════════
     PROFILE
  ════════════════════════════════════════ */
  function renderProfileSkills() {
    document.getElementById('skillsWrap').innerHTML = SKILLS.map((s, i) => `
      <div class="skill-chip">
        ${s}
        <button onclick="removeSkill(${i})">×</button>
      </div>`).join('');
  }

  function addSkill() {
    const input = document.getElementById('skillInput');
    const val = input.value.trim();
    if (!val || SKILLS.includes(val)) { input.value = ''; return; }
    SKILLS.push(val);
    input.value = '';
    renderProfileSkills();
    showToast(`"${val}" added to skills`);
  }

  function removeSkill(idx) {
    SKILLS.splice(idx, 1);
    renderProfileSkills();
  }

  function renderProfileStats() {
    const stats = [
      { label:'Member Since', val:'January 2025' },
      { label:'Jobs Completed', val:'342' },
      { label:'Average Rating', val:'4.9 ★' },
      { label:'Response Rate', val:'98%' },
      { label:'Profile Views', val:'1,240' },
    ];
    document.getElementById('profileStats').innerHTML = stats.map(s => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--ivory);border-radius:8px;border:1px solid rgba(201,148,58,.1)">
        <span style="font-size:13px;color:var(--muted)">${s.label}</span>
        <span style="font-size:13.5px;font-weight:500;color:var(--soil)">${s.val}</span>
      </div>`).join('');
  }

  function saveProfile() {
    const name = document.getElementById('pName').value.trim();
    if (name) {
      USER.name = name;
      updateGreeting();
      document.getElementById('sidebarName').textContent = name;
      document.getElementById('profileName').textContent = name;
    }
    showToast('Profile saved successfully!');
  }

  function updateSidebarUser() {
    document.getElementById('sidebarAvatar').textContent = USER.avatar;
    document.getElementById('sidebarName').textContent   = USER.name;
    document.getElementById('sidebarRole').textContent   = 'Worker';
    document.getElementById('profileAvatar').textContent = USER.avatar;
  }

  /* ════════════════════════════════════════
     LOGOUT
  ════════════════════════════════════════ */
  function doLogout() {
    showToast('Logging out…');
    setTimeout(() => window.location.href = 'login.html', 1200);
  }

  /* ════════════════════════════════════════
     TOAST
  ════════════════════════════════════════ */
  function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  /* ── sort btn style (shared) ── */
  const sortBtnStyle = `.sort-btn{padding:6px 14px;font-size:12.5px;font-weight:500;color:var(--muted);background:white;border:1.5px solid #e8dcc8;border-radius:99px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:color .22s,border-color .22s,background .22s}.sort-btn:hover{color:var(--earth);border-color:rgba(201,148,58,.3)}.sort-btn.active{color:var(--earth);border-color:var(--gold);background:rgba(201,148,58,.08)}`;
  const style = document.createElement('style');
  style.textContent = sortBtnStyle;
  document.head.appendChild(style);
  