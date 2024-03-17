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
        await addDoc(dbRef, data).then((s) => {
            console.log('INFO: User data saved to Firestore with ID:', s.id);
        });

    } catch (error) {
        console.error('WARNING: Error saving user to Firestore:', error);
        throw error;  // You might want to propagate the error to the caller
    }
}

export async function saveUserData(userId, firstName, lastName, age, sex, hometown) {
    try {
        const userDoc = await getUserData(userId);

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
        const userQuery = query(usersRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
            console.log('INFO: in gat user data: ', querySnapshot.docs[0]);
            return querySnapshot.docs[0];
        } else {
            throw new Error('User data not found');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

