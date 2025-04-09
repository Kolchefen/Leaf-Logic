/**
 * Main entry point for the Leaf Logic application
 */
import { initializeFirebase } from './firebaseConfig.js';
import authService from './AuthService.js';
import plantService from './PlantService.js';

// Global app state
const appState = {
  isInitialized: false,
  isAuthenticated: false,
  currentUser: null
};

/**
 * Initialize the application
 * @returns {Promise<void>}
 */
async function initializeApp() {
  try {
    // Check if already initialized
    if (appState.isInitialized) {
      console.log('App already initialized');
      return;
    }

    console.log('Initializing Leaf Logic application...');
    
    // Initialize Firebase services
    const { auth } = await initializeFirebase();
    
    // Initialize auth service
    authService.init();
    
    // Set up auth state listener
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log('User is signed in:', user.email);
        appState.isAuthenticated = true;
        appState.currentUser = user;
        
        // Redirect if on auth pages
        const currentPath = window.location.pathname;
        if (currentPath.includes('login.html') || currentPath.includes('register.html')) {
          window.location.href = 'userHomePage.html';
        }
        
        // Update UI elements for authenticated user
        updateUIForAuthenticatedUser(user);
      } else {
        console.log('User is signed out');
        appState.isAuthenticated = false;
        appState.currentUser = null;
        
        // Redirect to login if on protected pages
        const currentPath = window.location.pathname;
        if (!currentPath.includes('login.html') && 
            !currentPath.includes('register.html') && 
            !currentPath.includes('landingPage.html') && 
            !currentPath.includes('index.html')) {
          window.location.href = 'login.html';
        }
      }
    });
    
    // Set up global event listeners
    setupGlobalEventListeners();
    
    appState.isInitialized = true;
    console.log('App initialization complete');
  } catch (error) {
    console.error('Error initializing app:', error);
    // Show error UI
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = 'Failed to initialize the application. Please refresh and try again.';
    document.body.prepend(errorMessage);
  }
}

/**
 * Update UI elements based on authentication status
 * @param {Object} user - Firebase user object
 */
function updateUIForAuthenticatedUser(user) {
  // Update navbar
  const navbarUsernameElements = document.querySelectorAll('.navbar-username');
  navbarUsernameElements.forEach(el => {
    el.textContent = user.displayName || user.email;
  });
  
  // Update welcome message if it exists
  const welcomeElement = document.querySelector('.welcome-message');
  if (welcomeElement) {
    welcomeElement.textContent = `Welcome, ${user.displayName || user.email}!`;
  }
  
  // Show authenticated-only elements
  const authRequiredElements = document.querySelectorAll('.auth-required');
  authRequiredElements.forEach(el => {
    el.style.display = 'block';
  });
  
  // Hide non-authenticated elements
  const noAuthElements = document.querySelectorAll('.no-auth');
  noAuthElements.forEach(el => {
    el.style.display = 'none';
  });
}

/**
 * Set up global event listeners for the application
 */
function setupGlobalEventListeners() {
  // Handle logout clicks
  document.addEventListener('click', (event) => {
    if (event.target.matches('#logout-btn') || event.target.closest('#logout-btn')) {
      event.preventDefault();
      handleLogout();
    }
  });
  
  // Add other global event listeners as needed
}

/**
 * Handle user logout
 */
async function handleLogout() {
  try {
    await authService.logout();
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Error logging out:', error);
    alert('Failed to log out. Please try again.');
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export functions and state for use in other modules
export { appState, initializeApp };
