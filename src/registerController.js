/**
 * Register Controller - Handles user registration functionality
 * This file manages the registration process for new users
 */
import { initializeFirebase } from './firebaseConfig.js';
import authService from './AuthService.js';

class RegisterController {
  constructor() {
    this.auth = null;
    this.firebaseInitialized = false;
    this.registerForm = null;
    this.emailInput = null;
    this.passwordInput = null;
    this.confirmPasswordInput = null;
    this.emailError = null;
    this.passwordError = null;
  }

  /**
   * Initialize the register controller
   */
  async init() {
    try {
      console.log('Initializing Register Controller...');
      
      // Initialize Firebase if not already done
      const { auth } = await initializeFirebase();
      this.auth = auth;
      
      // Initialize auth service with the auth instance
      authService.init(auth);
      
      this.firebaseInitialized = true;
      console.log('Firebase initialized in Register Controller');
      
      // Set up DOM elements
      this.setupDOMElements();
      
      // Add event listeners
      this.setupEventListeners();
      
      console.log('Register Controller initialized');
    } catch (error) {
      console.error('Error initializing Register Controller:', error);
      this.showPasswordError('Failed to initialize authentication. Please try again.');
    }
  }

  /**
   * Set up DOM elements
   */
  setupDOMElements() {
    this.registerForm = document.getElementById('reg-signup-form');
    
    if (!this.registerForm) {
      console.error('Registration form not found');
      return;
    }
    
    this.emailInput = document.getElementById('reg-email');
    this.passwordInput = document.getElementById('reg-password');
    this.confirmPasswordInput = document.getElementById('reg-confirm-password');
    this.emailError = document.getElementById('email-error');
    this.passwordError = document.getElementById('password-error');
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    if (!this.registerForm) return;
    
    this.registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleRegistration();
    });
    
    // Add input validation
    if (this.emailInput) {
      this.emailInput.addEventListener('blur', () => {
        this.validateEmail();
      });
    }
    
    if (this.passwordInput && this.confirmPasswordInput) {
      this.passwordInput.addEventListener('blur', () => {
        this.validatePassword();
      });
      
      this.confirmPasswordInput.addEventListener('blur', () => {
        this.validatePassword();
      });
    }
  }

  /**
   * Validate email format
   * @returns {boolean} True if email is valid
   */
  validateEmail() {
    if (!this.emailInput || !this.emailError) return false;
    
    const email = this.emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      this.showEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      this.showEmailError('Please enter a valid email address');
      return false;
    } else {
      this.hideEmailError();
      return true;
    }
  }

  /**
   * Validate password format and match
   * @returns {boolean} True if password is valid
   */
  validatePassword() {
    if (!this.passwordInput || !this.confirmPasswordInput || !this.passwordError) return false;
    
    const password = this.passwordInput.value;
    const confirmPassword = this.confirmPasswordInput.value;
    
    // Password requirements: at least 6 chars, 1 letter, 1 number, 1 special char
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    
    if (!password) {
      this.showPasswordError('Password is required');
      return false;
    } else if (!passwordRegex.test(password)) {
      this.showPasswordError('Password must be at least 6 characters and include letters, numbers, and special characters');
      return false;
    } else if (password !== confirmPassword) {
      this.showPasswordError('Passwords do not match');
      return false;
    } else {
      this.hidePasswordError();
      return true;
    }
  }

  /**
   * Handle registration form submission
   */
  async handleRegistration() {
    // Validate inputs before submission
    const isEmailValid = this.validateEmail();
    const isPasswordValid = this.validatePassword();
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value;
    
    try {
      // Show loading state (you could add a loading spinner here)
      this.registerForm.classList.add('loading');
      
      // Attempt to register the user
      const userCredential = await authService.register(email, password);
      
      console.log('Registration successful!', userCredential.user);
      
      // Success - redirect to dashboard
      window.location.href = 'userHomePage.html';
    } catch (error) {
      console.error('Registration error:', error);
      
      // Show appropriate error message based on error code
      if (error.code === 'auth/email-already-in-use') {
        this.showEmailError('Email already in use. Try logging in instead.');
      } else if (error.code === 'auth/invalid-email') {
        this.showEmailError('Invalid email address.');
      } else if (error.code === 'auth/weak-password') {
        this.showPasswordError('Password is too weak.');
      } else {
        this.showPasswordError('Registration failed. Please try again.');
      }
    } finally {
      // Remove loading state
      this.registerForm.classList.remove('loading');
    }
  }

  /**
   * Show email error message
   * @param {string} message - Error message to display
   */
  showEmailError(message) {
    if (this.emailError) {
      this.emailError.textContent = message;
      this.emailError.classList.add('visible');
    }
  }

  /**
   * Hide email error message
   */
  hideEmailError() {
    if (this.emailError) {
      this.emailError.classList.remove('visible');
    }
  }

  /**
   * Show password error message
   * @param {string} message - Error message to display
   */
  showPasswordError(message) {
    if (this.passwordError) {
      this.passwordError.textContent = message;
      this.passwordError.classList.add('visible');
    }
  }

  /**
   * Hide password error message
   */
  hidePasswordError() {
    if (this.passwordError) {
      this.passwordError.classList.remove('visible');
    }
  }
}

// Create and export controller instance
const registerController = new RegisterController();
export default registerController;

// Initialize the controller when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  registerController.init();
});