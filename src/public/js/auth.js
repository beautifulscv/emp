import { MOCK_USER } from './config/constants.js';
import { sessionService } from './services/sessionService.js';
import { uiService } from './services/uiService.js';

// Auth service
export const auth = {
  setSession(userData) {
    sessionService.set(userData);
    uiService.updateAuthUI();
  },

  clearSession() {
    sessionService.clear();
    uiService.updateAuthUI();
  },

  getSession() {
    return sessionService.get();
  },

  updateUI() {
    uiService.updateAuthUI();
  }
};