// NESAMANI LOGIN SCRIPT

document.addEventListener("DOMContentLoaded", () => {

  const togglePw = document.getElementById("togglePw");
  const pwInput  = document.getElementById("password");
  const form     = document.getElementById("loginForm");
  const emailEl  = document.getElementById("email");

  /* PASSWORD TOGGLE */
  if (togglePw && pwInput) {
    togglePw.addEventListener("click", () => {
      const show = pwInput.type === "password";
      pwInput.type = show ? "text" : "password";

      const open   = togglePw.querySelector(".eye-open");
      const closed = togglePw.querySelector(".eye-closed");

      if (open)   open.style.display   = show ? "none" : "block";
      if (closed) closed.style.display = show ? "block" : "none";
    });
  }

  /* LIVE EMAIL VALIDATION */
  if (emailEl) {
    emailEl.addEventListener("blur", () => {
      const v = emailEl.value.trim();
      setFieldError(
        "email",
        "email-error",
        v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
          ? "Please enter a valid email."
          : ""
      );
    });
  }

  /* FORM SUBMIT */
  if (form) form.addEventListener("submit", handleLogin);

});


/* LOGIN HANDLER — INTEGRATED WITH api.js/auth.js */
async function handleLogin(e) {
  e.preventDefault();

  const emailEl = document.getElementById("email");
  const passEl  = document.getElementById("password");

  const email    = emailEl.value.trim();
  const password = passEl.value;

  let valid = true;

  /* VALIDATE EMAIL */
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError("email", "email-error", "Please enter a valid email.");
    valid = false;
  } else {
    setFieldError("email", "email-error", "");
  }

  /* VALIDATE PASSWORD */
  if (!password || password.length < 6) {
    setFieldError("password", "pw-error", "Password must be at least 6 characters.");
    valid = false;
  } else {
    setFieldError("password", "pw-error", "");
  }

  if (!valid) return;

  /* BUTTON LOADING */
  const btn = document.getElementById("loginBtn");
  if (btn) {
    btn.classList.add("loading");
    btn.disabled = true;
  }

  try {
    // Use standardized API
    const res = await API.auth.login({ email, password });
    
    if (!res.success) {
      throw new Error(res.error);
    }

    // Use auth.js standardized session
    saveSession(res.data);
    
    showToast("Login successful! Redirecting…");

    // Standard role redirect
    setTimeout(() => {
      redirectByRole(res.data.role);
    }, 1200);

  } catch (err) {
    showToast(err.message || "Login failed. Please try again.", true);
  } finally {
    if (btn) {
      btn.classList.remove("loading");
      btn.disabled = false;
    }
  }
}


/* FIELD ERROR HELPER */
function setFieldError(inputId, errorId, msg) {
  const errEl = document.getElementById(errorId);
  const inp   = document.getElementById(inputId);

  if (errEl) errEl.textContent = msg;
  if (inp) inp.classList.toggle("is-error", !!msg);
}


/* TOAST MESSAGE */
function showToast(msg, isError = false) {

  const toast = document.getElementById("toast");
  const icon  = toast.querySelector("svg");
  const text  = document.getElementById("toastMsg");

  text.textContent = msg;

  icon.style.color = isError ? "#c0392b" : "#6b8f6e";

  if (isError) {
    icon.innerHTML =
      '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
  } else {
    icon.innerHTML = '<polyline points="20 6 9 17 4 12"/>';
  }

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);

}