/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors');  // Import CORS middleware

// Initialize CORS
const corsHandler = cors({ origin: true }); // Allow all origins
admin.initializeApp();

try {
    const API_KEY = functions.config().sec.api_key;
    const AUTH_DOMAIN = functions.config().sec.auth_domain;
    const PROJECT_ID = functions.config().sec.project_id;
    const STORAGE_BUCKET = functions.config().sec.storage_bucket;
    const APP_ID = functions.config().sec.app_id;

    // Key Request HTTP function
    exports.getFirebaseConfig = functions.https.onRequest((req, res) => {
        corsHandler(req, res, () => {
            res.send({
                apiKey: API_KEY,
                authDomain: AUTH_DOMAIN,
                projectId: PROJECT_ID,
                storageBucket: STORAGE_BUCKET,
                appId: APP_ID
            });
        });
    });
} catch (error) {
    console.error("Error initializing Firebase configuration:", error.message);
    console.error("Stack trace:", error.stack);
}
