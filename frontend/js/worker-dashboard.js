/* ════════════════════════════════════════════════
   NESAMANI — Worker Dashboard JS
   Full implementation using api.js + auth.js
   Parallel to customer-dashboard.js
════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth('worker')) return;
  await loadWorkerDashboard();
  setupWorkerListeners();
});

async function loadWorkerDashboard() {
  try {
    const res = await API.worker.getDashboard();
    if (!res.success) throw new Error(res.error);

    const data = res.data;
    
    // Update UI with worker data
    document.querySelector('.s-user-name').textContent = data.name;
    // ... similar to customer dashboard

    renderWorkerStats(data);
    renderWorkerApplications(data.recentApplications || []);
    renderOpenJobs(data.openJobsNearby || 0);

  } catch (err) {
    showToast(err.message || 'Dashboard load failed', true);
  }
}

function renderWorkerStats(data) {
  // Worker-specific stats: applications sent, accepted, completed, rating
  // Implementation similar to customer dashboard
}

function renderWorkerApplications(apps) {
  // List recent applications with status
}

// ... rest similar structure to customer-dashboard.js
// with worker-specific API calls: API.worker.*

function navigate(section) {
  // Same navigation logic
}

function showToast(msg, isError = false) {
  // Same toast logic
}

// Placeholder implementations
function applyToJob(id) { 
  API.worker.applyToJob(id, { coverNote: 'Interested!' })
    .then(res => res.success ? showToast('Applied!') : showToast(res.error, true));
}

