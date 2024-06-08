import {getDownloadURL, ref as storageRef, uploadBytes} from "firebase/storage";
import {auth, db, storage} from "../config";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {getCurrentUser} from './users';


export async function uploadImageToStorage(imageUrl) {
    try {
        const imageRef = storageRef(storage, `images/${imageUrl}`);
        const blob = await fetch(imageUrl).then((res) => {
            if (!res.ok) {
                throw new Error('Failed to fetch image');
            }
            return res.blob();
        });

        const snapshot = await uploadBytes(imageRef, blob);
        return await getDownloadURL(snapshot.ref);
    } catch (error) {
        console.error('Error uploading image to storage:', error.message);
        throw error; // Propagate the error to the caller
    }
};

export async function deletePhoto(index) {
    const userId = auth.currentUser.uid; // Get the current user's ID
    const userDocRef = doc(db, 'users', userId); // Reference to the user document

    try {
        // Get the existing images array from the user document
        const userDoc = await getDoc(userDocRef);
        const existingUrls = userDoc.data().images || [];

        // Remove the URL at the specified index
        const updatedUrls = existingUrls.filter((_, i) => i !== index);

        // Update the user document with the updated image URLs
        await updateDoc(userDocRef, {images: updatedUrls});
        console.log('INFO: Image URL deleted successfully');
    } catch (error) {
        console.error('ERROR: Failed to delete image URL:', error.message);
    }
}


export async function saveUrl(url) {

    const userId = auth.currentUser.uid; // Get the current user's ID
    const userDocRef = doc(db, 'users', userId); // Reference to the user document

    try {
        // Get the current user's data
        const userData = await getCurrentUser();

        // Get the existing images array from the user data
        const existingUrls = userData.images || [];

        // Append the new URL to the existing URLs
        const updatedUrls = [...existingUrls, url];

        // Update the user document with the updated image URLs
        await updateDoc(userDocRef, {images: updatedUrls});
        console.log('INFO: Image URL saved successfully');
    } catch (error) {
        console.error('ERROR: Failed to save image URL:', error.message);
    }
}