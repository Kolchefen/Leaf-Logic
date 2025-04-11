/**
 * Login Controller - Handles login functionality
 * This file manages authentication for the login page
 */
import { initializeFirebase } from './firebaseConfig.js';
import authService from './AuthService.js';

class LoginController {
  constructor() {
    this.auth = null;
    this.firebaseInitialized = false;
    this.loginForm = null;
    this.emailInput = null;
    this.passwordInput = null;
    this.errorMessage = null;
  }

  /**
   * Initialize the login controller
   */
  async init() {
    try {
      console.log('Initializing Login Controller...');
      
      // Initialize Firebase if not already done
      const { auth } = await initializeFirebase();
      this.auth = auth;
      
      // Initialize auth service with the auth instance
      authService.init(auth);
      
      this.firebaseInitialized = true;
      console.log('Firebase initialized in Login Controller');
      
      // Set up DOM elements
      this.setupDOMElements();
      
      // Add event listeners
      this.setupEventListeners();
      
      console.log('Login Controller initialized');
    } catch (error) {
      console.error('Error initializing Login Controller:', error);
      this.showError('Failed to initialize authentication. Please try again.');
    }
  }

  /**
   * Set up DOM elements
   */
  setupDOMElements() {
    this.loginForm = document.getElementById('login-form');
    
    if (!this.loginForm) {
      console.error('Login form not found');
      return;
    }
    
    this.emailInput = document.getElementById('login-email');
    this.passwordInput = document.getElementById('login-password');
    this.errorMessage = document.getElementById('error-message');
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    if (!this.loginForm) return;
    
    this.loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleLogin();
    });
  }

  /**
   * Check if user is already authenticated
   */
  checkAuthState() {
    authService.auth.onAuthStateChanged(user => {
      if (user) {
        console.log('User already logged in, redirecting to dashboard');
        window.location.href = 'userHomePage.html';
      }
    });
  }

  /**
   * Handle login form submission
   */
  async handleLogin() {
    if (!this.emailInput || !this.passwordInput) return;
    
    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value;
    
    // Basic validation
    if (!email || !password) {
      this.showError('Please enter both email and password');
      return;
    }
    
    try {
      // Clear previous error message
      this.hideError();
      
      // Show loading state (you could add a loading spinner here)
      this.loginForm.classList.add('loading');
      
      // Attempt to log in
      await authService.login(email, password);
      
      // Success - redirect to dashboard
      window.location.href = 'userHomePage.html';
    } catch (error) {
      console.error('Login error:', error);
      
      // Show appropriate error message based on error code
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        this.showError('Invalid email or password');
      } else if (error.code === 'auth/too-many-requests') {
        this.showError('Too many failed login attempts. Please try again later.');
      } else {
        this.showError('Failed to log in. Please try again.');
      }
    } finally {
      // Remove loading state
      this.loginForm.classList.remove('loading');
    }
  }

  /**
   * Show error message
   * @param {string} message - Error message to display
   */
  showError(message) {
    if (this.errorMessage) {
      this.errorMessage.textContent = message;
      this.errorMessage.style.display = 'block';
    }
  }

  /**
   * Hide error message
   */
  hideError() {
    if (this.errorMessage) {
      this.errorMessage.style.display = 'none';
    }
  }
}

// Create and export controller instance
const loginController = new LoginController();
export default loginController;

// Initialize the controller when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  loginController.init();
});