/* ════════════════════════════════════════════════
   NESAMANI — Customer Dashboard JS
   Full implementation using api.js + auth.js
   Handles all nav sections: overview, post job, my jobs, find workers, etc.
════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {
  // Auth guard — redirects if not provider or no token
  if (!requireAuth('provider')) return;

  // Load user data and render everything
  await loadDashboard();
  setupEventListeners();
});

async function loadDashboard() {
  try {
    // Load provider dashboard data from API
    const res = await API.customer.getDashboard();
    if (!res.success) throw new Error(res.error);

    const data = res.data;
    
    // Update sidebar/user info
    document.getElementById('sidebarName').textContent = data.name;
    document.getElementById('sidebarAvatar').textContent = getUserInitial(data.name);
    document.getElementById('profileName').textContent = data.name;
    document.getElementById('profileAvatar').textContent = getUserInitial(data.name);

    // Update badges from data
    updateBadge('activeJobsBadge', data.active || 0);
    updateBadge('msgBadge', 3); // Mock for now
    updateBadge('notifBadge', 2); // Mock for now

    // Render overview stats
    renderOverviewStats(data);
    renderOverviewJobs(data.jobs || []);
    renderOverviewWorkers(data.availableWorkers || []);

    // Load other sections
    await renderAllJobs();
    await renderWorkers();

  } catch (err) {
    showToast(err.message || 'Failed to load dashboard', true);
  }
}

function setupEventListeners() {
  // Global search handlers, etc.
  document.getElementById('workerSearch').addEventListener('input', filterWorkers);
}

function renderOverviewStats(data) {
  const statsHtml = `
    <div class="stat-card">
      <div class="stat-icon si-gold">📊</div>
      <div class="stat-val">${data.totalJobs || 0}</div>
      <div class="stat-key">Total Jobs</div>
      <div class="stat-delta delta-up">+2 this week</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon si-cust">⏳</div>
      <div class="stat-val">${data.active || 0}</div>
      <div class="stat-key">Active</div>
      <div class="stat-delta delta-up">+1 today</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon si-sage">✅</div>
      <div class="stat-val">${data.completed || 0}</div>
      <div class="stat-key">Completed</div>
      <div class="stat-delta delta-up">98% satisfaction</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon si-earth">📱</div>
      <div class="stat-val">${data.pending || 0}</div>
      <div class="stat-key">Pending</div>
      <div class="stat-delta delta-warn">Awaiting responses</div>
    </div>
  `;
  document.getElementById('overviewStats').innerHTML = statsHtml;
}

function renderOverviewJobs(jobs) {
  const html = jobs.slice(0, 4).map(job => `
    <div class="job-row">
      <div class="job-icon">${job.icon || '🛠️'}</div>
      <div class="job-info">
        <div class="job-title">${job.title}</div>
        <div class="job-meta">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${locationIcon()}</svg>
          ${job.location}
          <span style="margin-left:8px;font-weight:500">•</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${clockIcon()}</svg>
          ${job.date}
        </div>
      </div>
      <span class="job-status status-${job.status}">${job.status}</span>
      <div class="job-amount">₹${job.budget || 'Neg.'}</div>
    </div>
  `).join('');
  document.getElementById('overviewActiveJobs').innerHTML = html || '<div style="padding:40px;text-align:center;color:var(--muted)">No active jobs yet</div>';
}

function renderOverviewWorkers(workers) {
  const html = workers.slice(0, 4).map(w => `
    <div class="w-card" onclick="chatWithWorker(${w.id})">
      <div class="w-card-top">
        <div class="w-avatar">${w.icon || '👤'}</div>
        <div>
          <div class="w-name">${w.name}</div>
          <div class="w-role">${w.category}</div>
        </div>
      </div>
      <div class="w-rating">★ ${w.rating || 0}</div>
      <button class="btn-hire">Message</button>
    </div>
  `).join('');
  document.getElementById('overviewWorkers').innerHTML = html || '<div style="padding:20px;text-align:center;color:var(--muted);grid-column:1/-1">No workers available</div>';
}

async function renderAllJobs() {
  const res = await API.customer.getMyJobs();
  if (res.success) renderJobsList(res.data, 'allJobs');
}

async function renderWorkers() {
  const res = await API.public.getWorkers({ location: 'nearby' });
  if (res.success) renderWorkerGrid(res.data);
}

function renderJobsList(jobs, containerId) {
  const container = document.getElementById(containerId);
  const html = jobs.map(job => `
    <div class="job-row" onclick="viewJobDetails(${job.id})">
      <div class="job-icon">${job.icon || '🛠️'}</div>
      <div class="job-info">
        <div class="job-title">${job.title}</div>
        <div class="job-meta">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">${locationIcon()}</svg>
          ${job.location} • ${job.category}
        </div>
      </div>
      <span class="job-status status-${job.status}">${job.status}</span>
      <div class="job-amount">₹${job.budget}</div>
    </div>
  `).join('');
  container.innerHTML = html || '<div style="padding:40px;text-align:center;color:var(--muted)">No jobs found</div>';
}

function renderWorkerGrid(workers) {
  document.getElementById('workerGrid').innerHTML = workers.map(w => `
    <div class="w-card" onclick="hireWorker(${w.id})">
      <div class="w-card-top">
        <div class="w-avatar ${w.availability}">
          <div class="w-dot ${w.availability}"></div>
          ${w.icon}
        </div>
        <div>
          <div class="w-name">${w.name}</div>
          <div class="w-role">${w.category || 'General'}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div class="w-rating">★ ${w.rating?.toFixed(1) || 0}</div>
        <div style="font-size:12px;color:var(--muted)">${w.jobsCompleted || 0} jobs</div>
      </div>
      <button class="btn-hire">Hire • ₹${w.hourlyRate || 'Ask'}</button>
    </div>
  `).join('');
}

function filterWorkers() {
  const term = document.getElementById('workerSearch').value.toLowerCase();
  // Client-side filter (or trigger API search)
  const cards = document.querySelectorAll('#workerGrid .w-card');
  cards.forEach(card => {
    const name = card.querySelector('.w-name')?.textContent.toLowerCase() || '';
    const role = card.querySelector('.w-role')?.textContent.toLowerCase() || '';
    card.style.display = name.includes(term) || role.includes(term) ? '' : 'none';
  });
}

async function postJob() {
  const formData = {
    title: document.getElementById('jobTitle').value,
    category: document.getElementById('jobCategory').value,
    location: document.getElementById('jobLocation').value,
    budget: document.getElementById('jobBudget').value,
    duration: document.getElementById('jobDuration').value,
    description: document.getElementById('jobDesc').value,
    expectedDate: document.getElementById('jobDate').value
  };

  if (!formData.title || !formData.category || !formData.location) {
    showToast('Please fill required fields', true);
    return;
  }

  const btn = document.getElementById('postBtn');
  btn.disabled = true;
  btn.innerHTML = 'Posting...';

  const res = await API.customer.postJob(formData);
  if (res.success) {
    showToast('Job posted successfully!');
    // Reset form and refresh jobs
    document.getElementById('registerForm').reset(); // Reuse form reset
    await renderAllJobs();
  } else {
    showToast(res.error, true);
  }

  btn.disabled = false;
  btn.innerHTML = 'Post Job →';
}

function filterJobs(btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.f;
  // Filter jobs client-side or API call
}

function navigate(section) {
  // Hide all sections
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Show target section
  document.getElementById(`sec-${section}`).classList.add('active');
  document.getElementById(`nav-${section}`).classList.add('active');

  // Update page title
  document.getElementById('pageTitle').textContent = section.charAt(0).toUpperCase() + section.slice(1);

  // Load section data if needed
  if (section === 'overview') loadDashboard();
  if (section === 'jobs') renderAllJobs();
  if (section === 'find') renderWorkers();
}

function doLogout() {
  logout();
}

function updateBadge(id, count) {
  const badge = document.getElementById(id);
  if (count > 0) {
    badge.textContent = count > 99 ? '99+' : count;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

function getUserInitial(name) {
  return name.charAt(0).toUpperCase();
}

function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  const icon = toast.querySelector('svg');
  const text = document.getElementById('toastMsg');
  text.textContent = msg;
  icon.style.color = isError ? 'var(--error)' : 'var(--sage)';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// Icon helpers
function locationIcon() { return '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'; }
function clockIcon() { return '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'; }

// Stub functions - implement as needed
function viewJobDetails(id) { showToast(`Viewing job ${id}`); }
function hireWorker(id) { showToast(`Hiring worker ${id}`); }
function chatWithWorker(id) { navigate('messages'); showToast(`Chatting with worker ${id}`); }
function saveProfile() { showToast('Profile updated!'); }

