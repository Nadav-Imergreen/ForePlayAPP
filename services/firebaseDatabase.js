// // firebaseDatabase.js
// import Firebase from "firebase/compat";
//
// export async function saveUserData(userId, firstname, lastname, profileImage) {
//   const data = {
//     userId: userId,
//     firstname: firstname,
//     lastname: lastname,
//   };
//
//   try {
//
//     const firebaseStorage = Firebase.storage
//
//     // Create a storage reference from our app
//     const storageRef = firebaseStorage.ref;
//
//     // const spaceRef = storageRef.child("../assets/google.png");
//     // console.log(spaceRef.ref);
//
//   } catch (error) {
//     console.error('Error saving user data to Firestore:', error);
//     throw error; // Propagate the error to the caller
//   }
// }

//firebaseDatabase.js
import { db } from './config';  // Update the path
import { collection, getDoc } from 'firebase/firestore';

export async function saveUserData(userId, firstname, lastname) {
  const data = {
    userId: userId,
    firstname: firstname,
    lastname: lastname
  };
  try {
    // Reference to the 'users' collection
    const dbRef = collection(db, 'data');

    // Add a document with the specified user data
    await getDoc(dbRef).then(s=>{
      console.log('User data saved to Firestore with ID:', s.data());});

  } catch (error) {
    console.error('Error saving user data to Firestore:', error);
    throw error;  // You might want to propagate the error to the caller
  }
}
