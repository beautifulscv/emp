import { initLoginForm } from './auth/loginForm.js';
import { authState } from './auth/authState.js';
import { initAuthUI } from './auth/authUI.js';

// Modal functionality
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('loginModal');
  const loginBtn = document.getElementById('loginBtn');
  const closeBtn = modal?.querySelector('.close');
  const logoutBtn = document.getElementById('logoutBtn');

  // Initialize auth UI
  initAuthUI();

  // Guard clause if modal doesn't exist
  if (!modal) return;

  // Initialize login form
  initLoginForm(modal);

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

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      authState.clearSession();
    });
  }
});