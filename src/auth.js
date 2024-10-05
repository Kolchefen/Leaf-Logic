// Global variables
let auth;
let db;

// Function to fetch Firebase configuration and initialize Firebase
async function fetchFirebaseConfig() {
    try {
        const response = await fetch('https://us-central1-projectw-6c4cd.cloudfunctions.net/getFirebaseConfig'); // Replace with your actual URL
        const config = await response.json();

        // Initialize Firebase with the fetched config
        firebase.initializeApp(config);

        // Initialize Firebase Auth and Firestore
        auth = firebase.auth(); // Now auth is initialized
        db = firebase.firestore(); // Now db is initialized

        console.log('Firebase Auth initialized');
    } catch (error) {
        console.error("Error fetching Firebase config:", error);
    }
}

// Function to set up event listeners
function setupEventListeners() {
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = signupForm['email'].value;
        const password = signupForm['password'].value;

        if (validateEmail() && validatePassword()) {
            try {
                const cred = await auth.createUserWithEmailAndPassword(email, password);
                const user = cred.user;
                console.log('User created:', user);
                // Redirect or perform other actions here
            } catch (error) {
                console.error("Error signing up:", error.code, error.message);
            }
            signupForm.reset();
        }
    });

    // Add more event listeners here, if needed
}

// Call the fetchFirebaseConfig to initialize Firebase
fetchFirebaseConfig().then(() => {
    setupEventListeners(); // Now set up event listeners only after auth is initialized
});


// // User sign-up form
// const signupForm = document.getElementById('signup-form');
// signupForm.addEventListener('submit', (e) => {
//     e.preventDefault();

//     const email = signupForm['email'].value;
//     const password = signupForm['password'].value;

    
//     if (validateEmail() && validatePassword()) {
//         // User Creation 
//         auth.createUserWithEmailAndPassword(email, password).then(cred => {
//             const user = cred.user;
//             window.location.href = "index.html"; // TODO: change to main application page, after it is made ofc !!!
//         })
//         .catch((error) => {
//             const errorCode = error.code;
//             const errorMessage = error.message;
//             // Handle error messages here
//             console.error("Error signing up:", errorCode, errorMessage);
//         });

//         signupForm.reset();
//     }
// }); 


// Logout function, TODO: apply to an actual signout interface,i.e. give a button id logout
const logout = document.getElementById('logout')
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
    auth.signOut.then(() => {
        console.log('User signed out');
    })
});

// Real-time validation as user types
document.getElementById('email').addEventListener('input', validateEmail);
document.getElementById('password').addEventListener('input', validatePassword);
document.getElementById('confirm-password').addEventListener('input', validatePassword);


function validatePassword(event) {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const message = document.getElementById('password-error');
    
    // Reset error messages
    message.classList.add('visible');

    // Password should contain at least one letter, one number, and one special character
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
        message.style.color = 'red';
        message.textContent = 'Password must 6 characters long, contain a letter, a number, and special character';
        event.preventDefault();
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
    const email = document.getElementById('email').value;
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

const loginForm = document.getElementById(login-form);
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get inputs
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    // Sign in user
    auth.signInWithEmailAndPassword(email, password).then(cred =>{
        console.log(cred.user);
        // window.location.href = "index.html"; // TODO: change to main application page, after it is made ofc !!!
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error logging in:", errorCode, errorMessage);
        // Handle error messages here
    });  
    
});

// Listen for auth status changes
auth.onAuthStateChanged(user => {
    console.log(user);
});
