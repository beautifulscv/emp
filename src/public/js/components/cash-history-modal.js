export function initCashHistoryModal() {
  const modal = document.getElementById('cashHistoryModal');
  const viewAllBtn = document.getElementById('viewAllCashHistory');
  const closeBtn = modal.querySelector('.close');
  const tabs = modal.querySelectorAll('.tab-button');

  viewAllBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // Add tab switching logic here
    });
  });
}