//firebaseDatabase.js
import {db} from './config'; // Update the path
import {addDoc, collection, doc, getDocs, query, updateDoc, where} from 'firebase/firestore';

export async function saveUser(userId, email) {
 // check if user exist in database
  if (await getUserData(userId)) return;

  console.log('INFO: in save user: ', userId, email)
  const data = {
    userId: userId,
    email: email,
    userInfoSetup: false // Add userInfoSetup field
  };
  try {
    // Reference to the 'users' collection
    const dbRef = collection(db, 'users');

    // Add a document with the specified user data
    await addDoc(dbRef, data).then((s) =>{
      console.log('INFO: User data saved to Firestore with ID:', s.id);});

  } catch (error) {
    console.error('WARNING: Error saving user to Firestore:', error);
    throw error;  // You might want to propagate the error to the caller
  }
}

export async function saveUserData(userId, firstName, lastName, age, sex, hometown) {
  try {
    // Query the 'users' collection to find the document with the specified userId or email
    const userQuerySnapshot = await getDocs(query(collection(db, 'users'), where('userId', '==', userId)));

    if (userQuerySnapshot.empty) {
      // If no document is found, return or handle the error accordingly
      throw new Error('WARNING: User not found');
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

    console.log('INFO: User data updated successfully');
  } catch (error) {
    console.error('WARNING: Error updating user data:', error);
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
      return querySnapshot.docs[0].data();
    } else {
      throw new Error('User data not found');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

