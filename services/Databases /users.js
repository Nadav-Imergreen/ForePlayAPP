//firebaseDatabase.js
import {auth, db} from '../config';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import {deleteUserAccount} from "../auth";

export async function saveUser(userId, email) {

    // check if user exist in database - skip this function
    const userData = await getCurrentUser();
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

export async function saveUserInfo(data) {
    // Update the document with the new user information
    const userId = auth.currentUser.uid;
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, data)
        .then(() => console.log('INFO: User data updated successfully'))
        .catch((error) => console.error('WARNING: Error updating user data:', error))
}

export async function saveUserPreferences(gender, ageRange, radius, location) {
    // Update the document with the new user preferences
    const userId = auth.currentUser.uid;
    await updateDoc(doc(db, 'users', userId), {
        partner_gender: gender,
        preferredAgeRange: ageRange,
        radius: radius,
        location: location
    })
        .then(() => console.log('INFO: User preferences updated successfully'))
        .catch((error) => console.error('WARNING: Error updating user preferences:', error));
}


export async function saveExtraInfo(aboutMe, desireMatch) {
    // Update the document with the new user preferences
    const userId = auth.currentUser.uid;
    await updateDoc(doc(db, 'users', userId), {
        aboutMe: aboutMe,
        desireMatch: desireMatch
    })
        .then(() => console.log('INFO: User extra info updated successfully'))
        .catch((error) => console.error('WARNING: Error updating user extra info:', error));
}

export async function saveUserLocation(location) {
    try {
        // Get the current user's ID
        const userId = auth.currentUser.uid;

        // Reference to the user document
        const userDocRef = doc(db, 'users', userId);

        // Update the user document with the provided location
        await updateDoc(userDocRef, {location: location});

        console.log('INFO: User location saved successfully');
    } catch (error) {
        console.error('ERROR: Failed to save user location:', error.message);
    }
}

export async function getCurrentUser() {
    try {
        const userId = auth.currentUser.uid;
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    } catch {
        throw Error("WARNING: users doc not found!")
    }
}


export async function getUser(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    } catch {
        throw Error("WARNING: Doc not found!")
    }
}

export async function getAllUsers(gender) {
    try {
        const coll = collection(db, "users");
        const q = query(coll, where("sex", "!=", gender));
        return await getDocs(q);
    } catch {
        throw Error("WARNING: Docs not found!")
    }
}

export async function getUsersBy(user) {
    try {
        const minAge = user.preferredAgeRange[0].toString();
        const maxAge = user.preferredAgeRange[1].toString();
        const defaultGender = user.sex === 'male' ? 'female' : 'male';
        const coll = collection(db, "users");
        const q = query(coll,
            where("sex", "==", user.partner_gender ? user.partner_gender : defaultGender));
            // where('age', '<=', maxAge ? maxAge : (user.age + 7)),
            // where('age', '>=', minAge ? minAge : user.age / 2 + 7));
        return await getDocs(q);
    } catch (error) {
        throw new Error("WARNING: Error retrieving documents: " + error.message);
    }
}

export const saveAiProfile = async (id, userProfile) => {
    // Update the document with profile build by AI
    await updateDoc(doc(db, 'users', id), {
        aiProfile: userProfile
    })
        .then(() => console.log('INFO: User preferences updated successfully with ai profile'))
        .catch((error) => console.error('WARNING: Error updating user preferences with ai profile:', error));
}
