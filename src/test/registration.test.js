const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Read your HTML file (assuming it's named register.html)
const html = fs.readFileSync(path.resolve(__dirname, '../register.html'), 'utf8');

// Set up JSDOM and expose document and window globals
const { window } = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
global.window = window;
global.document = window.document;

// Import your validation functions
const { validateEmail, validatePassword } = require('../register.js'); // Adjust the path as needed

// Sample data for testing
const emailSamples = [
  'test@example.com', 'invalid-email', 'user@domain.com', 'user@domain', 'user@.com',
  // Add more email samples here
];

const passwordSamples = [
  { password: 'Password123!', confirmPassword: 'Password123!' },
  { password: '123', confirmPassword: '123' },
  { password: 'Password!', confirmPassword: 'Password!' },
  { password: 'Password123', confirmPassword: 'Password123' },
  { password: 'Password123!', confirmPassword: 'Password123' },
  // Add more password samples here
];

describe('Registration Form Validation', () => {
  emailSamples.forEach((email, index) => {
    it(`should validate email format correctly for sample ${index + 1}`, () => {
      const emailInput = document.getElementById('reg-email');
      emailInput.value = email;

      const result = validateEmail();
      if (email.includes('@') && email.includes('.')) {
        expect(result).to.be.true;
      } else {
        expect(result).to.be.false;
      }
    });
  });

  passwordSamples.forEach((sample, index) => {
    it(`should validate password format correctly for sample ${index + 1}`, () => {
      const passwordInput = document.getElementById('reg-password');
      const confirmPasswordInput = document.getElementById('reg-confirm-password');
      passwordInput.value = sample.password;
      confirmPasswordInput.value = sample.confirmPassword;

      const result = validatePassword();
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      if (passwordRegex.test(sample.password) && sample.password === sample.confirmPassword) {
        expect(result).to.be.true;
      } else {
        expect(result).to.be.false;
      }
    });
  });
});
