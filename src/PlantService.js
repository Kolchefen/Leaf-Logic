import { 
    collection, doc, addDoc, updateDoc, deleteDoc, 
    getDoc, getDocs, query, where, orderBy, 
    serverTimestamp, Timestamp 
  } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
  import { ref, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js';
  import { db, storage } from './firebaseConfig.js';
  import Plant from './Plants.js';
  import authService from './AuthService.js';

  
  
  class PlantService {
    constructor() {
      this.db = db;
      this.storage = storage;
    }
  
    /**
     * Get a reference to the plants subcollection for the current user
     * @returns {CollectionReference} Firestore collection reference
     */
    getPlantsCollection() {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User must be authenticated to access plants');
      }
      return collection(this.db, 'users', currentUser.uid, 'plants');
    }
  
    /**
     * Add a new plant to the user's collection
     * @param {Plant} plant - Plant object to add
     * @param {File} photoFile - Optional photo file to upload
     * @returns {Promise<string>} plantId - ID of the created plant document
     */
    async addPlant(plant, photoFile = null) {
      try {
        // First, upload the photo if provided
        let photoUrl = '';
        if (photoFile) {
          photoUrl = await this.uploadPlantPhoto(photoFile);
        }
  
        // Create the plant with the photo URL
        const plantData = {
          ...plant.toFirestore(),
          photoUrl,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
  
        // Add the plant to Firestore, Single most important line in here, sets the ref 
        const docRef = await addDoc(this.getPlantsCollection(), plantData);
        console.log('Plant added with ID:', docRef.id);
        return docRef.id;
      } catch (error) {
        console.error('Error adding plant:', error);
        throw error;
      }
    }
  
    /**
     * Update an existing plant
     * @param {string} plantId - ID of the plant to update
     * @param {Plant} plantData - Updated plant data
     * @param {File} photoFile - Optional new photo to upload
     * @returns {Promise<void>}
     */
    async updatePlant(plantId, plantData, photoFile = null) {
      try {
        const plantRef = doc(this.getPlantsCollection(), plantId);
        
        // Check if the plant exists
        const plantDoc = await getDoc(plantRef);
        if (!plantDoc.exists()) {
          throw new Error(`Plant with ID ${plantId} not found`);
        }
  
        // If a new photo is provided, upload it and update the URL
        let photoUrl = plantData.photoUrl;
        if (photoFile) {
          // Delete the old photo if it exists
          if (plantDoc.data().photoUrl) {
            try {
              const oldPhotoRef = ref(this.storage, plantDoc.data().photoUrl);
              await deleteObject(oldPhotoRef);
            } catch (error) {
              console.warn('Failed to delete old photo:', error);
              // Continue with the update even if deleting the old photo fails
            }
          }
          // Upload the new photo
          photoUrl = await this.uploadPlantPhoto(photoFile);
        }
  
        // Update the plant document
        const updatedData = {
          ...plantData.toFirestore(),
          photoUrl,
          updatedAt: serverTimestamp()
        };
  
        await updateDoc(plantRef, updatedData);
        console.log('Plant updated successfully');
      } catch (error) {
        console.error('Error updating plant:', error);
        throw error;
      }
    }
  
    /**
     * Delete a plant
     * @param {string} plantId - ID of the plant to delete
     * @returns {Promise<void>}
     */
    async deletePlant(plantId) {
      try {
        const plantRef = doc(this.getPlantsCollection(), plantId);
        
        // Get the plant data first to check for photos to delete
        const plantDoc = await getDoc(plantRef);
        if (!plantDoc.exists()) {
          throw new Error(`Plant with ID ${plantId} not found`);
        }
  
        // If the plant has a photo, delete it from storage
        if (plantDoc.data().photoUrl) {
          try {
            const photoRef = ref(this.storage, plantDoc.data().photoUrl);
            await deleteObject(photoRef);
            console.log('Plant photo deleted successfully');
          } catch (error) {
            console.warn('Failed to delete plant photo:', error);
          }
        }
  
        // Delete the plant document
        await deleteDoc(plantRef);
        console.log('Plant deleted successfully');
      } catch (error) {
        console.error('Error deleting plant:', error);
        throw error;
      }
    }
  
    /**
     * Get a plant by ID
     * @param {string} plantId - ID of the plant to retrieve
     * @returns {Promise<Plant|null>} Plant object or null if not found
     */
    async getPlant(plantId) {
      try {
        const plantRef = doc(this.getPlantsCollection(), plantId);
        const plantDoc = await getDoc(plantRef);
        
        if (!plantDoc.exists()) {
          console.log(`Plant with ID ${plantId} not found`);
          return null;
        }
        
        return Plant.fromFirestore(plantDoc.id, plantDoc.data());
      } catch (error) {
        console.error('Error getting plant:', error);
        throw error;
      }
    }
  
    /**
     * Get all plants for the current user
     * @returns {Promise<Plant[]>} Array of Plant objects
     */
    async getAllPlants() {
      try {
        const plantsQuery = query(
          this.getPlantsCollection(),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(plantsQuery);
        // For each doc map it to a Plant object
        // and return the array of Plant objects
        return querySnapshot.docs.map(doc => 
          Plant.fromFirestore(doc.id, doc.data())
        );
      } catch (error) {
        console.error('Error getting plants:', error);
        throw error;
      }
    }
  
    /**
     * Upload a plant photo to Firebase Storage
     * @param {File} file - Photo file to upload
     * @returns {Promise<string>} Download URL for the uploaded photo
     */
    async uploadPlantPhoto(file) {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          throw new Error('User must be authenticated to upload photos');
        }
  
        // Create a unique file name using a timestamp and the original file extension
        const fileExtension = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExtension}`;
        const filePath = `users/${currentUser.uid}/plants/${fileName}`;
        
        // Create a reference to the file location in Firebase Storage
        const fileRef = ref(this.storage, filePath);
        
        // Upload the file
        const snapshot = await uploadBytes(fileRef, file);
        console.log('Photo uploaded successfully');
        
        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      } catch (error) {
        console.error('Error uploading photo:', error);
        throw error;
      }
    }
  
    /**
     * Record a watering event for a plant
     * @param {string} plantId - ID of the plant
     * @returns {Promise<void>}
     */
    async recordWatering(plantId) {
      try {
        const plantRef = doc(this.getPlantsCollection(), plantId);
        await updateDoc(plantRef, {
          lastWatered: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log('Watering recorded successfully');
      } catch (error) {
        console.error('Error recording watering:', error);
        throw error;
      }
    }
  
    /**
     * Record a fertilizing event for a plant
     * @param {string} plantId - ID of the plant
     * @returns {Promise<void>}
     */
    async recordFertilizing(plantId) {
      try {
        const plantRef = doc(this.getPlantsCollection(), plantId);
        await updateDoc(plantRef, {
          lastFertilized: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log('Fertilizing recorded successfully');
      } catch (error) {
        console.error('Error recording fertilizing:', error);
        throw error;
      }
    }
  
    /**
     * Get the plant context object to provide to the AI assistant
     * This formats the plant data in a way that's useful for the AI
     * @returns {Promise<Object>} Plant context object
     */
    async getPlantContext() {
      try {
        const plants = await this.getAllPlants();
        
        // Format the plants for the AI context
        return {
          plantCount: plants.length,
          plants: plants.map(plant => ({
            id: plant.id,
            name: plant.name,
            type: plant.type,
            location: plant.location,
            description: plant.description,
            plantedDate: plant.plantedDate ? plant.plantedDate.toDateString() : null,
            lastWatered: plant.lastWatered ? plant.lastWatered.toDateString() : 'Never',
            lastFertilized: plant.lastFertilized ? plant.lastFertilized.toDateString() : 'Never',
            careInstructions: plant.careInstructions || {}
          }))
        };
      } catch (error) {
        console.error('Error getting plant context for AI:', error);
        return { plantCount: 0, plants: [] };
      }
    }
  }
  
  // Create and export a singleton instance
  const plantService = new PlantService();
  export default plantService;