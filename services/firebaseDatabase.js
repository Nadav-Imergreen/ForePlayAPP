//firebaseDatabase.js
import {auth, db} from './config'; // Update the path
import {collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where} from 'firebase/firestore';

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
        .catch((error) => console.error('WARNING: Error saving user to Firestore:', error));
}

export async function saveUserInfo(firstName, lastName, age, sex, hometown, occupation, desireMatch) {
    // Update the document with the new user information
    const userId = auth.currentUser.uid;
    await updateDoc(doc(db, 'users', userId), {
        firstName: firstName,
        lastName: lastName,
        age: age,
        sex: sex,
        hometown: hometown,
        occupation: occupation,
        desireMatch: desireMatch
    }).then(() => console.log('INFO: User data updated successfully'))
        .catch((error) => console.error('WARNING: Error updating user data:', error))
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

export async function saveUrl(url) {
    const userId = auth.currentUser.uid;
    await updateDoc(doc(db, 'users', userId), {
        url: url
    }).then(() => console.log('INFO: User data updated successfully'))
        .catch((error) => console.error('WARNING: Error updating user data:', error))
}

export async function saveAdditionalInfo( occupation, desireMatch) {
    const userId = auth.currentUser.uid;
    await updateDoc(doc(db, 'users', userId), {
        occupation: occupation,
        desireMatch: desireMatch
    }).then(() => console.log('INFO: User data updated successfully'))
        .catch((error) => console.error('WARNING: Error updating user data:', error))
}