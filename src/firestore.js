/**
 * Creates a plant entry under a specific user.
 * @param {string} userId - The ID of the user.
 * @param {string} photoUrl - The URL of the plant photo.
 * @param {string} name - The name of the plant.
 * @param {string} location - The location of the plant.
 * @returns {Promise<void>}
 */

// This is the function that will send user data to the firestore database,
// which will then allow the user to see their plant data on the website. 
// User verification is now ensured each time someone attempts to update their databse information.
async function createPlantEntry(userId, photoUrl, name, location) {
    try {
        const idToken = await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true);
        await admin.auth().verifyIdToken(idToken);
        await db.collection('users').doc(userId).collection('plants').add({
            photoUrl: photoUrl,
            name: name,
            location: location,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('Plant entry created successfully');
    } catch (error) {
        console.error('Error creating plant entry: ', error);
    }
}

async function uploadPhoto(file) {
    const storageRef = firebase.storage().ref(); // Add () after `storage`
    const photoRef = storageRef.child(`photos/${file.name}`);
    
    try {
        const snapshot = await photoRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        return downloadURL;
    } catch (error) {
        console.error('Error uploading photo: ', error);
        throw error;
    }
}


async function setData() {
    try {
        await db.collection('users').add({
            uID: document.getElementById('uID').value,
            userEmail: document.getElementById('userEmail').value,
        });
        console.log('entry created successfully');
    } catch (error) {
        console.error('Error creating plant entry: ', error);
    }
}