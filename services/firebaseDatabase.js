// firebaseDatabase.js
import { db, storage } from './config';
import { collection, addDoc } from 'firebase/firestore';

export async function saveUserData(userId, firstname, lastname, profileImage) {
  const data = {
    userId: userId,
    firstname: firstname,
    lastname: lastname,
  };

  try {
    // Reference to the 'users' collection
    const dbRef = collection(db, 'users');

    // Add a document with the specified user data
    const docRef = await addDoc(dbRef, data);
    console.log('User data saved to Firestore with ID:', docRef.id);

    // Create a storage reference
    // const storageRef = ref(storage, `profileImages/${userId}`);

    // Points to the root reference
    const storageRef = storage.reference
    // Upload profile image to Firebase Storage
    //await uploadString(storageRef, profileImage, 'base64', { contentType: 'image/jpeg' });

    // Get the download URL of the uploaded image
    //const downloadURL = await getDownloadURL(storageRef);
    console.log('Profile image uploaded. Download URL:', downloadURL);
  } catch (error) {
    console.error('Error saving user data to Firestore:', error);
    throw error; // Propagate the error to the caller
  }
}
