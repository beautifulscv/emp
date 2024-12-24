// Authentication UI management
import { authState } from './authState.js';

export function initAuthUI() {
  const loginSection = document.querySelector('.login-section');
  const userSection = document.querySelector('.user-section');
  
  if (!loginSection || !userSection) return;
  
  // Update UI based on current auth state
  function updateUI() {
    const user = authState.getUser();

    if (user) {
      loginSection.style.display = 'none';
      userSection.style.display = 'flex';
      
      const avatar = userSection.querySelector('.user-avatar');
      const username = userSection.querySelector('.username');
      
      if (avatar) avatar.src = user.avatarUrl;
      if (username) username.textContent = user.username;
    } else {
      loginSection.style.display = 'flex';
      userSection.style.display = 'none';
    }
  }

  // Add listener for auth state changes
  authState.addListener(updateUI);

  // Initial UI update
  updateUI();
}