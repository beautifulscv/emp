// Authentication UI management
import { authState } from './authState.js';

export function initAuthUI() {
  const loginSection = document.querySelector('.login-section');
  const userSection = document.querySelector('.user-section');

  console.log('initAuthUI::addListener');
  // Add listener for auth state changes
  authState.addListener(updateUI);

  console.log('initAuthUI::init');
  // if (!loginSection || !userSection) return; //

  // Update UI based on current auth state
  function updateUI() {
    console.log('updateUI')
    const user = authState.getUser();
    console.log('user:', user);

    if (user) {
      if(loginSection) loginSection.style.display = 'none';
      if(userSection) userSection.style.display = 'flex';

      if(userSection) {
        const avatar = userSection.querySelector('.user-avatar');
        const username = userSection.querySelector('.username');

        if (avatar) avatar.src = user.avatarUrl;
        if (username) username.textContent = user.username;
      }
    } else {
      if(loginSection) loginSection.style.display = 'flex';
      if(userSection) userSection.style.display = 'none';
    }
  }


  // Initial UI update
  updateUI();
}
