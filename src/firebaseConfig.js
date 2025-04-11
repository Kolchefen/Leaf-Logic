// Firebase configuration using Firebase SDK v9 from CDN
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js';

let firebaseApp;
let auth;
let db;
let storage;

// Firebase configuration
// For development, we'll fetch the config from the server
async function initializeFirebase() {
  try {
    const response = await fetch('https://us-central1-projectw-6c4cd.cloudfunctions.net/getFirebaseConfig');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Firebase config: ${response.status}`);
    }
    
    const firebaseConfig = await response.json();
    
    // Initialize Firebase
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
    storage = getStorage(firebaseApp);
    
    console.log('Firebase initialized successfully');
    
    return { auth, db, storage };
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
}

// Export the initialization function and services
export { initializeFirebase, auth, db, storage };