//firebaseDatabase.js
import {db} from './config'; // Update the path
import {collection, addDoc} from 'firebase/firestore';

export async function saveUserData(userId, firstname, lastname) {
  const data = {
    userId: userId,
    firstname: firstname,
    lastname: lastname,
  };
  try {
    // Reference to the 'users' collection
    const dbRef = collection(db, 'users');
    console.log('test ', firstname);
    // Add a document with the specified user data
    await addDoc(dbRef, data).then(dbRef => {
      console.log('User data saved to Firestore with ID:', dbRef.id);
    });
  } catch (error) {
    console.error('Error saving user data to Firestore:', error);
    throw error; // You might want to propagate the error to the caller
  }
}
