// Authentication service class
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile
  } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
  import { auth } from './firebaseConfig.js';
  
  class AuthService {
    constructor() {
      this.auth = auth;
      this.currentUser = null;
      
      // Set up auth state listener once the auth is available
      this.authStateListener = null;
    }
  
    /**
     * Initialize the auth service and set up listeners
     * @param {object} auth - Firebase Auth instance
     * @returns {void}
     */
    init(auth) {
      if (!auth) {
        console.error('Auth instance is required for initialization');
        return;
      }

      this.auth = auth;

      this.authStateListener = onAuthStateChanged(this.auth, (user) => {
        this.currentUser = user;
        if (user) {
          console.log('User is signed in:', user.email);
        } else {
          console.log('User is signed out');
        }
      });
    }
  
    /**
     * Register a new user with email and password
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @param {string} displayName - Optional display name
     * @returns {Promise<UserCredential>}
     */
    async register(email, password, displayName = '') {
      try {
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        
        // If display name is provided, update the user profile
        if (displayName) {
          await updateProfile(userCredential.user, {
            displayName: displayName
          });
        }
        
        return userCredential;
      } catch (error) {
        console.error('Error registering user:', error);
        throw error;
      }
    }
  
    /**
     * Sign in an existing user
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Promise<UserCredential>}
     */
    async login(email, password) {
      try {
        return await signInWithEmailAndPassword(this.auth, email, password);
      } catch (error) {
        console.error('Error logging in:', error);
        throw error;
      }
    }
  
    /**
     * Sign out the current user
     * @returns {Promise<void>}
     */
    async logout() {
      try {
        await signOut(this.auth).then(() => {
          this.cleanup(); // Clean up the auth state listener
          this.currentUser = null; // Clear the current user
          console.log('User signed out successfully');
        });
      } catch (error) {
        console.error('Error logging out:', error);
        throw error;
      }
    }
  
    /**
     * Get the current authenticated user
     * @returns {User|null} The current user or null if not authenticated
     */
    getCurrentUser() {
      return this.auth.currentUser;
    }
  
    /**
     * Send a password reset email
     * @param {string} email - User's email
     * @returns {Promise<void>}
     */
    async resetPassword(email) {
      try {
        await sendPasswordResetEmail(this.auth, email);
      } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
      }
    }
  
    /**
     * Clean up the auth state listener
     */
    cleanup() {
      if (this.authStateListener) {
        this.authStateListener();
      }
    }
  }
  
  // Create and export a singleton instance
  const authService = new AuthService();
  export default authService;