import { MOCK_USER } from './config/constants.js';
import { auth } from './auth.js';

// Modal functionality
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('loginModal');
  const loginBtn = document.getElementById('loginBtn');
  const closeBtn = document.querySelector('.close');
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      modal.style.display = 'block';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('userId').value;
      const password = document.getElementById('userPassword').value;

      if (id === MOCK_USER.id && password === MOCK_USER.password) {
        auth.setSession({
          id: MOCK_USER.id,
          username: MOCK_USER.username,
          avatarUrl: MOCK_USER.avatarUrl
        });
        modal.style.display = 'none';
        loginForm.reset();
      } else {
        alert('Invalid credentials');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      auth.clearSession();
    });
  }

  // Initialize UI based on session
  auth.updateUI();
});