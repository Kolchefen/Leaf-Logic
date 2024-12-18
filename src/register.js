// Real-time validation as user types
document.getElementById('reg-email').addEventListener('input', validateEmail);
document.getElementById('reg-password').addEventListener('input', validatePassword);
document.getElementById('reg-confirm-password').addEventListener('input', validatePassword);

function validatePassword() {
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const message = document.getElementById('password-error');

    // Reset error messages
    message.classList.add('visible');

    // Password should contain at least one letter, one number, and one special character
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
        message.style.color = 'red';
        message.textContent = 'Password must be 6 characters long, contain a letter, a number, and a special character';
        return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        message.style.color = 'red';
        message.textContent = 'Passwords do not match.';
        return false;
    }

    message.textContent = 'Passwords match!';
    message.style.color = 'green';
    return true;
}

function validateEmail() {
    const email = document.getElementById('reg-email').value;
    const emailError = document.getElementById('email-error');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the email is valid
    if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address';
        emailError.style.visibility = 'visible';  // Ensure the message is visible
        return false;
    } else {
        emailError.textContent = ''; // Clear error message
        emailError.style.visibility = 'hidden'; // Hide when valid
        return true;
    }
}

// Function to set up event listeners
function setupEventListeners() {
    const signupForm = document.getElementById('reg-signup-form');
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = signupForm['reg-email'].value;
        const password = signupForm['reg-password'].value;

        if (validateEmail() && validatePassword()) {
            try {
                const cred = await auth.createUserWithEmailAndPassword(email, password);
                const user = cred.user;

                console.log('User created:', user);
                // Redirect or perform other actions here
                window.location.href = "userHomePage.html";
            } catch (error) {
                console.error("Error signing up:", error.code, error.message);
                document.getElementById('reg-signup-form').reset();
            }
        }
    });

    // Add more event listeners here, if needed
}

// Call the setupEventListeners function to initialize event listeners
setupEventListeners();
