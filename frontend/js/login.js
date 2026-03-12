// Nesamani Login

// Password toggle
const togglePw = document.getElementById('togglePw');
const pwInput  = document.getElementById('password');
if (togglePw) {
  togglePw.addEventListener('click', () => {
    const isText = pwInput.type === 'text';
    pwInput.type = isText ? 'password' : 'text';
    togglePw.querySelector('.eye-open').style.display  = isText ? 'block' : 'none';
    togglePw.querySelector('.eye-closed').style.display = isText ? 'none'  : 'block';
  });
}

// Toast helper
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  const icon  = toast.querySelector('svg');
  document.getElementById('toastMsg').textContent = msg;
  icon.style.color = isError ? '#c0392b' : '#6b8f6e';
  if (isError) {
    icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
  } else {
    icon.innerHTML = '<polyline points="20 6 9 17 4 12"/>';
  }
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// Field validation helper
function setError(id, msg) {
  const el = document.getElementById(id);
  const input = document.getElementById(id.replace('-error',''));
  if (el) el.textContent = msg;
  if (input) input.classList.toggle('is-error', !!msg);
}

// Live validation
document.getElementById('email').addEventListener('blur', function() {
  const v = this.value.trim();
  setError('email-error', v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Please enter a valid email.' : '');
});

// Form submit
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  let valid = true;

  // Validate
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('email-error', 'Please enter a valid email.');
    valid = false;
  } else {
    setError('email-error', '');
  }

  if (!password || password.length < 6) {
    setError('pw-error', 'Password must be at least 6 characters.');
    valid = false;
  } else {
    setError('pw-error', '');
  }

  if (!valid) return;

  // Loading state
  const btn = document.getElementById('loginBtn');
  btn.classList.add('loading');
  btn.disabled = true;

  try {
    const res = await fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Invalid credentials.');

    // Store token if provided
    if (data.token) localStorage.setItem('token', data.token);

    showToast('Welcome back! Redirecting…');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1400);

  } catch (err) {
    showToast(err.message || 'Login failed. Please try again.', true);
    btn.classList.remove('loading');
    btn.disabled = false;
  }
});