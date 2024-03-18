//firebaseDatabase.js
import {auth, db} from './config'; // Update the path
import {setDoc, getDoc, collection, doc, updateDoc} from 'firebase/firestore';

export async function saveUser(userId, email) {

    // check if user exist in database - skip this function
    const userData = await getUserData(userId);
    if (userData) {
        console.log('INFO: User', email, 'already exists in Firestore');
        return; // Exit the function if user already exists
    }


    console.log('INFO: in save user: ', email)
    const data = {
        userId: userId,
        email: email,
    };
    // Reference to the 'users' collection
    const usersRef = collection(db, 'users');
    await setDoc(doc(usersRef, userId), data)
        .then(() => console.log('INFO: User', email, 'saved to Firestore'))
        .catch((error)=> console.error('WARNING: Error saving user to Firestore:', error));
}

export async function saveUserInfo(firstName, lastName, age, sex, hometown) {
    // Update the document with the new user information
    const userId = auth.currentUser.uid;
    await updateDoc(doc(db, 'users', userId), {
        firstName: firstName,
        lastName: lastName,
        age: age,
        sex: sex,
        hometown: hometown
    }).then(()=> console.log('INFO: User data updated successfully'))
        .catch((error)=> console.error('WARNING: Error updating user data:', error))
}

export async function getUserData(userId) {

    const docRef =  doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap) return docSnap.data();
    else console.log("WARNING: No such document!");
}

