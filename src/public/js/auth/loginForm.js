// Login form handling with improved security and UX
import { MOCK_USER } from '../config/constants.js';
import { authState } from './authState.js';

export function initLoginForm(modal) {
  const form = modal.querySelector('#loginForm');
  if (!form) return;

  const userIdInput = form.querySelector('#userId');
  const passwordInput = form.querySelector('#userPassword');
  const submitButton = form.querySelector('.login-submit');

  // Rate limiting setup
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
  let failedAttempts = 0;
  let lockoutEndTime = 0;

  function showError(message, fieldId = null) {
    const errorElement = fieldId
        ? form.querySelector(`#${fieldId}`).closest('.form-group').querySelector('.error-message')
        : form.querySelector('.form-group .error-message');

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.closest('.form-group').classList.add('error');
    }
  }

  function clearError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  function clearAllErrors() {
    form.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('error');
      const errorElement = group.querySelector('.error-message');
      if (errorElement) {
        errorElement.textContent = '';
      }
    });
  }

  function validateForm() {
    let isValid = true;
    clearAllErrors();

    if (!userIdInput.value.trim()) {
      showError('아이디를 입력해주세요', 'userId');
      isValid = false;
    }

    if (!passwordInput.value.trim()) {
      showError('비밀번호를 입력해주세요', 'userPassword');
      isValid = false;
    }

    return isValid;
  }

  function setLoadingState(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? '로그인 중...' : '로그인';

    // Disable inputs during loading
    userIdInput.disabled = isLoading;
    passwordInput.disabled = isLoading;

    // Optional: Add loading spinner class
    if (isLoading) {
      submitButton.classList.add('loading');
    } else {
      submitButton.classList.remove('loading');
    }
  }

  function isLockedOut() {
    if (Date.now() < lockoutEndTime) {
      const remainingMinutes = Math.ceil((lockoutEndTime - Date.now()) / 60000);
      showError(`너무 많은 로그인 시도가 있었습니다. ${remainingMinutes}분 후에 다시 시도해주세요.`);
      return true;
    }
    return false;
  }

  function handleFailedAttempt() {
    failedAttempts++;

    if (failedAttempts >= MAX_ATTEMPTS) {
      lockoutEndTime = Date.now() + LOCKOUT_DURATION;
      failedAttempts = 0;
      showError(`너무 많은 로그인 시도가 있었습니다. 15분 후에 다시 시도해주세요.`);
      return false;
    }

    const remainingAttempts = MAX_ATTEMPTS - failedAttempts;
    showError(`로그인에 실패했습니다. ${remainingAttempts}번의 시도가 남았습니다.`);
    return true;
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

    if (!validateForm() || isLockedOut()) return;

    setLoadingState(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const userId = userIdInput.value;
      const password = passwordInput.value;

      if (userId === MOCK_USER.id && password === MOCK_USER.password) {
        // Successful login
        failedAttempts = 0;
        authState.setSession({
          id: MOCK_USER.id,
          username: MOCK_USER.username,
          avatarUrl: MOCK_USER.avatarUrl
        });
        modal.style.display = 'none';
        form.reset();
        clearAllErrors();
      } else {
        // Failed login
        if (!handleFailedAttempt()) {
          return; // Don't proceed if locked out
        }

        // Clear password field on failed attempt
        passwordInput.value = '';
      }
    } catch (error) {
      console.error('Login error:', error);
      showError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoadingState(false);
    }
  });
}
