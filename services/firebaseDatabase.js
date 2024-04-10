//firebaseDatabase.js
import {auth, db} from './config'; // Update the path
import {collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where} from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/config';
import {deleteUserAccount} from "./auth";

export async function saveUser(userId, email) {

    // check if user exist in database - skip this function
    const userData = await getUserData();
    if (userData) {
        console.log('INFO: User', email, 'already exists in Firestore');
        return;
    }

    const data = {
        userId: userId,
        email: email,
    };
    // Reference to the 'users' collection
    const usersRef = collection(db, 'users');
    await setDoc(doc(usersRef, userId), data)
        .then(() => console.log('INFO: User', email, 'saved to Firestore'))
        .catch((error) => {
            console.error('WARNING: Error saving user to Firestore:', error);
            deleteUserAccount();
            alert('WARNING: User not registered, due to error in saving user info to database');
        });
}

export async function saveUserInfo(firstName, lastName, age, sex, hometown, occupation, desireMatch, aboutMe) {
    // Update the document with the new user information
    const userId = auth.currentUser.uid;
    await updateDoc(doc(db, 'users', userId), {
        firstName: firstName,
        lastName: lastName,
        age: age,
        sex: sex,
        hometown: hometown,
        occupation: occupation,
        desireMatch, desireMatch,
        aboutMe: aboutMe

    }).then(() => console.log('INFO: User data updated successfully'))
        .catch((error) => console.error('WARNING: Error updating user data:', error))
}

export async function saveUserPreferences(gender, age_bottom_limit, age_upper_limit, radius) {
    // Update the document with the new user preferences
    const userId = auth.currentUser.uid;
    await updateDoc(doc(db, 'users', userId), {
        partner_gender: gender,
        partner_age_bottom_limit: age_bottom_limit,
        partner_age_upper_limit: age_upper_limit,
        radius: radius
    })
    .then(() => console.log('INFO: User preferences updated successfully'))
    .catch((error) => console.error('WARNING: Error updating user preferences:', error));
}

export async function saveUserLocation(location) {
    try {
        // Get the current user's ID
        const userId = auth.currentUser.uid;

        // Reference to the user document
        const userDocRef = doc(db, 'users', userId);

        // Update the user document with the provided location
        await updateDoc(userDocRef, { location: location });

        console.log('INFO: User location saved successfully');
    } catch (error) {
        console.error('ERROR: Failed to save user location:', error.message);
    }
}

export async function getUserData() {
    try {
        const userId = auth.currentUser.uid;
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    } catch {throw Error("WARNING: Doc not found!")}
}

export async function getAllUsers(gender) {
    try {
        const coll = collection(db, "users");
        const q = query(coll, where("sex", "==", gender));
        // doc.data() is never undefined for query doc snapshots
        return await getDocs(q);
    }catch {throw Error("WARNING: Docs not found!")}
}

export async function getUsersBy(gender, minAge, maxAge) {
    
    try {
        const coll = collection(db, "users");
        const q = query(coll, 
            where("sex", "==", gender),
        );
        return await getDocs(q);
    } catch (error) {
        throw Error("WARNING: Error retrieving documents: " + error.message);
    }
}

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
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
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
        await updateDoc(userDocRef, { images: updatedUrls });
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
        const userData = await getUserData();
        
        // Get the existing images array from the user data
        const existingUrls = userData.images || [];

        // Append the new URL to the existing URLs
        const updatedUrls = [...existingUrls, url];

        // Update the user document with the updated image URLs
        await updateDoc(userDocRef, { images: updatedUrls });
        console.log('INFO: Image URL saved successfully');
    } catch (error) {
        console.error('ERROR: Failed to save image URL:', error.message);
    }
}

export async function saveAdditionalInfo( occupation, desireMatch) {
    const userId = auth.currentUser.uid;
    await updateDoc(doc(db, 'users', userId), {
        occupation: occupation,
        desireMatch: desireMatch
    }).then(() => console.log('INFO: User data updated successfully'))
        .catch((error) => console.error('WARNING: Error updating user data:', error))
}