// Login form handling
import { MOCK_USER } from '../config/constants.js';
import { authState } from './authState.js';

export function initLoginForm(modal) {
  const form = modal.querySelector('#loginForm');
  if (!form) return;

  const userIdInput = form.querySelector('#userId');
  const passwordInput = form.querySelector('#userPassword');
  const submitButton = form.querySelector('.login-submit');

  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  function clearError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
  }

  function clearAllErrors() {
    form.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('error');
    });
  }

  function validateForm() {
    let isValid = true;
    clearAllErrors();

    if (!userIdInput.value.trim()) {
      showError(userIdInput, '아이디를 입력해주세요');
      isValid = false;
    }

    if (!passwordInput.value.trim()) {
      showError(passwordInput, '비밀번호를 입력해주세요');
      isValid = false;
    }

    return isValid;
  }

  // Input event listeners for real-time validation
  [userIdInput, passwordInput].forEach(input => {
    input.addEventListener('input', () => {
      clearError(input);
      submitButton.disabled = false;
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    submitButton.disabled = true;

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userId = userIdInput.value;
    const password = passwordInput.value;

    if (userId === MOCK_USER.id && password === MOCK_USER.password) {
      authState.setSession({
        id: MOCK_USER.id,
        username: MOCK_USER.username,
        avatarUrl: MOCK_USER.avatarUrl
      });
      modal.style.display = 'none';
      form.reset();
      clearAllErrors();
    } else {
      showError(userIdInput, '아이디 또는 비밀번호가 올바르지 않습니다');
      showError(passwordInput, '아이디 또는 비밀번호가 올바르지 않습니다');
    }

    submitButton.disabled = false;
  });
}