document.addEventListener('DOMContentLoaded', () => {

  // Toggle password visibility
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling.previousElementSibling; // ugly but works
      const icon = btn.querySelector('i');

      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
      }
    });
  });

  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();

      const email = loginForm.querySelector('[name="email"]').value.trim();
      const password = loginForm.querySelector('[name="password"]').value;

      // Very basic client-side check (real validation should be on server)
      if (!email || !password) {
        showMessage(loginForm, 'Please fill in all fields', 'error');
        return;
      }

      // Here you would normally send to backend (fetch / axios)
      showMessage(loginForm, 'Logging in...', 'success');

      // Simulate delay → redirect
      setTimeout(() => {
        window.location.href = '../Banner Management/banner.html'; // ← change to your dashboard
      }, 1200);
    });
  }

  // Register form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();

      const name = registerForm.querySelector('[name="name"]').value.trim();
      const email = registerForm.querySelector('[name="email"]').value.trim();
      const password = registerForm.querySelector('[name="password"]').value;
      const confirm = registerForm.querySelector('[name="confirmPassword"]').value;

      if (!name || !email || !password || !confirm) {
        showMessage(registerForm, 'All fields are required', 'error');
        return;
      }

      if (password.length < 8) {
        showMessage(registerForm, 'Password must be at least 8 characters', 'error');
        return;
      }

      if (password !== confirm) {
        showMessage(registerForm, 'Passwords do not match', 'error');
        return;
      }

      showMessage(registerForm, 'Creating account...', 'success');

      // Simulate API call
      setTimeout(() => {
        showMessage(registerForm, 'Account created! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1800);
      }, 1400);
    });
  }

  // Helper: show temporary message under form
  function showMessage(form, text, type) {
    let msg = form.querySelector('.form-message');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'form-message';
      form.appendChild(msg);
    }

    msg.textContent = text;
    msg.className = `form-message ${type}`;
    
    setTimeout(() => {
      msg.textContent = '';
    }, 5000);
  }

});