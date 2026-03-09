// ── Nesamani Register ────────────────────────────────────

// Role toggle
const roleToggle = document.getElementById('roleToggle');
const roleInput  = document.getElementById('role');
const roleBtns   = document.querySelectorAll('.role-btn');

roleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    roleBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    roleInput.value = btn.dataset.role;
    if (btn.dataset.role === 'provider') {
      roleToggle.classList.add('provider-active');
    } else {
      roleToggle.classList.remove('provider-active');
    }
  });
});

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

// Password strength meter
const strengthFill  = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

pwInput.addEventListener('input', function() {
  const val = this.value;
  if (!val) {
    strengthFill.className = 'strength-fill';
    strengthFill.style.width = '0';
    strengthLabel.textContent = '';
    return;
  }
  const score = getStrength(val);
  const levels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const classes = ['', 's1', 's2', 's3', 's4'];
  strengthFill.className = `strength-fill ${classes[score]}`;
  strengthLabel.textContent = levels[score];
  const colors = ['', '#c0392b', '#d4a96a', '#c9943a', '#6b8f6e'];
  strengthLabel.style.color = colors[score];
});

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

// Field error helper
function setError(fieldId, errorId, msg) {
  const errEl  = document.getElementById(errorId);
  const input  = document.getElementById(fieldId);
  if (errEl) errEl.textContent = msg;
  if (input) input.classList.toggle('is-error', !!msg);
}

// Live validation
document.getElementById('email').addEventListener('blur', function() {
  const v = this.value.trim();
  setError('email','email-error', v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Please enter a valid email.' : '');
});

document.getElementById('phone').addEventListener('blur', function() {
  const v = this.value.replace(/\s/g,'');
  setError('phone','phone-error', v && !/^\+?[0-9]{8,15}$/.test(v) ? 'Enter a valid phone number.' : '');
});

// Form submit
document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const name     = document.getElementById('name').value.trim();
  const email    = document.getElementById('email').value.trim();
  const phone    = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value;
  const role     = document.getElementById('role').value;
  const terms    = document.getElementById('terms').checked;

  let valid = true;

  if (!name || name.length < 2) {
    setError('name','name-error','Please enter your full name.'); valid = false;
  } else { setError('name','name-error',''); }

  if (!/^\+?[0-9\s]{8,15}$/.test(phone.replace(/\s/g,''))) {
    setError('phone','phone-error','Enter a valid phone number.'); valid = false;
  } else { setError('phone','phone-error',''); }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('email','email-error','Please enter a valid email.'); valid = false;
  } else { setError('email','email-error',''); }

  if (password.length < 8) {
    setError('password','pw-error','Password must be at least 8 characters.'); valid = false;
  } else { setError('password','pw-error',''); }

  if (!terms) {
    showToast('Please accept the Terms & Conditions.', true); return;
  }

  if (!valid) return;

  const btn = document.getElementById('registerBtn');
  btn.classList.add('loading');
  btn.disabled = true;

  try {
    const res = await fetch('http://localhost:8080/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password, role })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed.');

    showToast('Account created! Redirecting to login…');
    setTimeout(() => { window.location.href = 'login.html'; }, 1600);

  } catch (err) {
    showToast(err.message || 'Registration failed. Please try again.', true);
    btn.classList.remove('loading');
    btn.disabled = false;
  }
});