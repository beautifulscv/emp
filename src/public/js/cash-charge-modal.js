// Cash charge modal functionality
export function initCashChargeModal() {
  const modal = document.getElementById('cashChargeModal');
  const cashChargeBtn = document.getElementById('cashChargeBtn');
  const closeBtn = modal.querySelector('.close');
  const methodTabs = modal.querySelectorAll('.method-tab');
  
  // Open modal
  cashChargeBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });
  
  // Close modal
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Close on outside click
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Tab switching
  methodTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      methodTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}