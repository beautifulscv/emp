import { sessionService } from './sessionService.js';

// UI update service
export const uiService = {
  updateAuthUI() {
    const loginSection = document.querySelector('.login-section');
    const userSection = document.querySelector('.user-section');
    const user = sessionService.get();

    if (user) {
      loginSection.style.display = 'none';
      userSection.style.display = 'flex';
      userSection.querySelector('.user-avatar').src = user.avatarUrl;
      userSection.querySelector('.username').textContent = user.username;
    } else {
      loginSection.style.display = 'flex';
      userSection.style.display = 'none';
    }
  }
};