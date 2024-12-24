import { sessionService } from './services/sessionService.js';

function initMyPage() {
  const user = sessionService.get();
  if (!user) {
    window.location.href = '/';
    return;
  }

  // Update profile information
  const avatar = document.getElementById('userAvatar');
  const username = document.getElementById('username');
  
  if (avatar) avatar.src = user.avatarUrl;
  if (username) username.textContent = user.username;
}

document.addEventListener('DOMContentLoaded', initMyPage);