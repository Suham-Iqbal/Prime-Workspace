document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('loggedInUser')) {
    window.location.href = 'index.html';
  }

  // Load user storage system
  const script = document.createElement('script');
  script.src = 'userStorage.js';
  document.head.appendChild(script);

  const loginCard = document.getElementById('login-card');
  const signupCard = document.getElementById('signup-card');
  const showSignupLink = document.getElementById('show-signup');
  const showLoginLink = document.getElementById('show-login');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  const showAlert = (alertElementId, message, type = 'danger') => {
    const alertPlaceholder = document.getElementById(alertElementId);
    alertPlaceholder.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  };

  showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginCard.classList.add('d-none');
    signupCard.classList.remove('d-none');
  });

  showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupCard.classList.add('d-none');
    loginCard.classList.remove('d-none');
  });

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const role = document.querySelector('input[name="userRole"]:checked').value;

    try {
      // Wait for UserStorage to be available
      setTimeout(() => {
        try {
          UserStorage.createUser({ username, email, password, role });
          showAlert('login-alert', 'Account created successfully! Please log in.', 'success');
          signupForm.reset();
          showLoginLink.click();
        } catch (error) {
          showAlert('signup-alert', error.message);
        }
      }, 100);
    } catch (error) {
      // Fallback to original method if UserStorage not available
      const users = JSON.parse(localStorage.getItem('users')) || [];
      if (users.find(user => user.email === email)) {
        showAlert('signup-alert', 'An account with this email already exists.');
        return;
      }

      users.push({ username, email, password, role, createdAt: new Date().toISOString() });
      localStorage.setItem('users', JSON.stringify(users));
      
      showAlert('login-alert', 'Account created successfully! Please log in.', 'success');
      signupForm.reset();
      showLoginLink.click();
    }
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
      // Wait for UserStorage to be available
      setTimeout(() => {
        try {
          const user = UserStorage.authenticateUser(email, password);
          if (user) {
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
            sessionStorage.setItem('login_success', 'true'); 
            window.location.href = 'index.html';
          } else {
            showAlert('login-alert', 'Invalid email or password.');
          }
        } catch (error) {
          showAlert('login-alert', 'Login failed. Please try again.');
        }
      }, 100);
    } catch (error) {
      // Fallback to original method
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email === email);

      if (user && user.password === password) {
        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        sessionStorage.setItem('login_success', 'true'); 
        window.location.href = 'index.html';
      } else {
        showAlert('login-alert', 'Invalid email or password.');
      }
    }
  });
});