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
import { collection, addDoc, getDocs, updateDoc, query, where, doc } from 'firebase/firestore';

export async function saveUser(userId, email) {
 
  const data = {
    userId: userId,
    email: email,
    userInfoSetup: false // Add userInfoSetup field
  };
  try {
    // Reference to the 'users' collection
    const dbRef = collection(db, 'users');

    // Add a document with the specified user data
    await addDoc(dbRef, data).then(s=>{
      console.log('User data saved to Firestore with ID:', dbRef.id);});

  } catch (error) {
    console.error('Error saving user data to Firestore:', error);
    throw error;  // You might want to propagate the error to the caller
  }
}

export async function saveUserData(userId, firstName, lastName, age, sex, hometown) {
  try {
    // Query the 'users' collection to find the document with the specified userId or email
    const userQuerySnapshot = await getDocs(query(collection(db, 'users'), where('userId', '==', userId)));

    if (userQuerySnapshot.empty) {
      // If no document is found, return or handle the error accordingly
      throw new Error('User not found');
    }

    // Get the first document from the query result
    const userDoc = userQuerySnapshot.docs[0];

    // Update the document with the new user information
    await updateDoc(doc(db, 'users', userDoc.id), {
      firstName: firstName,
      lastName: lastName,
      age: age,
      sex: sex,
      hometown: hometown,
      userInfoSetup: true // Update userInfoSetup to indicate that user info setup is complete
    });

    console.log('User data updated successfully');
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
}

export async function getUserData(userId) {
  try {
    const usersRef = collection(db, 'users');
    console.log('userId ' + userId);
    const userQuery = query(usersRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return userData;
    } else {
      throw new Error('User data not found');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

