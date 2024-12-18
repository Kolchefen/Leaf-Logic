// Global variables
let auth, db, storage;

// Declare firebaseConfigUrl
let firebaseConfigUrl;
const useEmulator = false;

// For local Development on the emulator
if (false) {
    fetch(firebaseConfigUrl).then(response => response.json()).then(config => {
        firebase.initializeApp(config);
    
        auth = firebase.auth();
        db = firebase.firestore();
        storage = firebase.storage();
    
        if (useEmulator) {
            auth.useEmulator("http://localhost:9099");
            db.useEmulator("http://localhost:8099");
            storage.useEmulator("http://localhost:9199");
            console.log('Firebase emulators initialized');
        }
     
        auth.onAuthStateChanged(user => {
            if (user != null) {
                console.log("Auth State Changed: " + user.email);
            }
        });
    }).catch(error => {
        console.error("Error fetching Firebase config:", error.message);
        console.error("Stack trace:", error.stack);
    });
} else {
    firebaseConfigUrl = 'https://us-central1-projectw-6c4cd.cloudfunctions.net/getFirebaseConfig';
    fetch(firebaseConfigUrl).then(response => response.json()).then(config => {
        firebase.initializeApp(config);

        auth = firebase.auth();
        db = firebase.firestore();
        storage = firebase.storage();

        // Set up auth state change listener after initialization
        auth.onAuthStateChanged(user => {
            if (user != null) {
                console.log("Auth State Changed: " + user.email);
            }
        });
    }).catch(error => {
        console.error("Error fetching Firebase config:", error);
    });
}