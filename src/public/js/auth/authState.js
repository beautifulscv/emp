// Authentication state management
import { sessionService } from '../services/sessionService.js';

class AuthState {
  constructor() {
    this.listeners = new Set();
  }

  // Add state change listener
  addListener(callback) {
    this.listeners.add(callback);
  }

  // Remove state change listener
  removeListener(callback) {
    this.listeners.delete(callback);
  }

  // Notify all listeners of state change
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.getUser()));
  }

  // Get current user
  getUser() {
    return sessionService.get();
  }

  // Set user session
  setSession(userData) {
    sessionService.set(userData);
    document.cookie = `auth=${JSON.stringify(userData)}; path=/`;
    this.notifyListeners();
  }

  // Clear user session
  clearSession() {
    sessionService.clear();
    document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.notifyListeners();
  }
}

export const authState = new AuthState();