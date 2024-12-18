const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const firebase = require('firebase-mock');

// Mock Firebase Database
const mockDatabase = new firebase.MockFirebase();
const mockAuth = new firebase.MockFirebase();
const mockSDK = new firebase.MockFirebaseSdk(
  () => mockAuth,
  () => mockDatabase
);

// Replace Firebase imports with mocks
mockSDK.initializeApp();

// Read your HTML file (assuming it's named register.html)
const html = fs.readFileSync(path.resolve(__dirname, '../register.html'), 'utf8');

// Set up JSDOM and expose document and window globals
const { window } = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
global.window = window;
global.document = window.document;

// Import your validation functions
const { validateEmail, validatePassword } = require('../register.js'); // Adjust the path as needed

describe('Registration Form Validation', () => {
  beforeEach(() => {
    // Reset mock database data before each test
    mockDatabase.autoFlush();
  });

  it('should validate email format correctly', () => {
    const emailInput = document.getElementById('reg-email');
    emailInput.value = 'test@example.com';

    const result = validateEmail();
    expect(result).to.be.true;
  });

  it('should validate password format correctly', () => {
    const passwordInput = document.getElementById('reg-password');
    const confirmPasswordInput = document.getElementById('reg-confirm-password');
    passwordInput.value = 'Password123!';
    confirmPasswordInput.value = 'Password123!';

    const result = validatePassword();
    expect(result).to.be.true;
  });

  it('should prevent form submission if validation fails', () => {
    const emailInput = document.getElementById('reg-email');
    emailInput.value = 'invalid-email';

    const passwordInput = document.getElementById('reg-password');
    const confirmPasswordInput = document.getElementById('reg-confirm-password');
    passwordInput.value = '123';
    confirmPasswordInput.value = '123';

    const emailValid = validateEmail();
    const passwordValid = validatePassword();

    expect(emailValid && passwordValid).to.be.false;
  });

  it('should check if user exists in the database', (done) => {
    // Simulate a user in the mock database
    const userId = 'testUser123';
    const userData = { username: 'TestUser', email: 'test@example.com' };

    // Set user data in the mock database
    mockDatabase.child('users').child(userId).set(userData, () => {
      // Retrieve user data from the mock database
      mockDatabase.child('users').child(userId).once('value', (snapshot) => {
        const data = snapshot.val();

        // Verify user exists and data matches
        expect(data).to.deep.equal(userData);
        done();
      });
    });
    done();
  });
});
