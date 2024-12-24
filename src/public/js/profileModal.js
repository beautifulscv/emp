// Profile modal functionality
export function initProfileModal() {
  const profileModal = document.getElementById('profileModal');
  const userProfile = document.querySelector('.user-profile');
  const closeBtn = profileModal.querySelector('.close');
  
  userProfile.addEventListener('click', () => {
    profileModal.style.display = 'block';
    
    // Update profile info
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      document.getElementById('profileAvatar').src = user.avatarUrl;
    }
  });
  
  closeBtn.addEventListener('click', () => {
    profileModal.style.display = 'none';
  });
  
  window.addEventListener('click', (event) => {
    if (event.target === profileModal) {
      profileModal.style.display = 'none';
    }
  });
}