//firebaseDatabase.js
import {auth, db, storage} from './config';
import {collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where} from 'firebase/firestore';
import {getDownloadURL, ref as storageRef, uploadBytes} from 'firebase/storage';
import {deleteUserAccount} from "./auth";

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

export async function getCurrentUser() {
    try {
        const userId = auth.currentUser.uid;
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    } catch {throw Error("WARNING: Doc not found!")}
}

async function getUser(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    } catch {throw Error("WARNING: Doc not found!")}
}

export async function getAllUsers(gender) {
    try {
        const coll = collection(db, "users");
        const q = query(coll, where("sex", "==", gender));
        return await getDocs(q);
    }catch {throw Error("WARNING: Docs not found!")}
}

export async function getUsersBy(gender) {
    try {
        const coll = collection(db, "users");
        let q;
        if (!gender) {
            q = query(coll);
        } else {
            q = query(coll, where("sex", "==", gender));
        }
        return await getDocs(q);
    } catch (error) {
        throw new Error("WARNING: Error retrieving documents: " + error.message);
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
        return await getDownloadURL(snapshot.ref);
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
        const userData = await getCurrentUser();
        
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

export async function saveLike(uid) {
    const currentUser = auth.currentUser.uid;
    const currentUserRef = doc(db, 'users',currentUser); // Reference to the user document

    try {
        // Get the current user's data
        const currentUser = await getCurrentUser();

        // Get the existing images array from the user data
        const LikedList = currentUser.likedUsers || [];

        // Append the new URL to the existing URLs
        const updatedLikedList = [...LikedList].includes(uid)? [...LikedList] : [...LikedList, uid];

        // Update the user document with the updated image URLs
        await updateDoc(currentUserRef, { likedUsers: updatedLikedList });

        console.log('INFO: new like saved successfully')
    } catch (error) {
        console.error('ERROR: Failed to save new like:', error.message);
    }
}


export async function
saveSeen(uid) {
    const currentUser = auth.currentUser.uid;
    const currentUserRef = doc(db, 'users',currentUser); // Reference to the user document

    try {
        // Get the current user's data
        const currentUser = await getCurrentUser();

        // Get the existing images array from the user data
        const SeenList = currentUser.seenUsers || [];

        // Append the new URL to the existing URLs
        const updatedSeenList = [...SeenList].includes(uid)? [...SeenList] : [...SeenList, uid];

        // Update the user document with the updated image URLs
        await updateDoc(currentUserRef, { seenUsers: updatedSeenList });

        console.log('INFO: seen user saved successfully')
    } catch (error) {
        console.error('ERROR: Failed to save seen user:', error.message);
    }
}

export async function saveLikeMe(uid) {
    const likedUserRef = doc(db, 'users', uid); // Reference to the user document
    const currentUser = auth.currentUser.uid;

    try {
    const likedUser = await getUser(uid);
    const LikedMeList = likedUser.likedMeUsers || [];
    const updatedLikedMeList = [...LikedMeList].includes(currentUser)? [...LikedMeList] : [...LikedMeList, currentUser];
    await updateDoc(likedUserRef, { likedMeUsers: updatedLikedMeList});
        console.log('INFO: new likeMe saved successfully')
    } catch (error) {
        console.error('ERROR: Failed to save new like:', error.message);
    }
}

export async function checkForMatch(likedUser) {
    const currentUser = await getCurrentUser();
    console.log('INFO: in check match: likedUser = ', likedUser);
    const LikedMeList = currentUser.likedMeUsers || [];
    console.log('INFO: LikedMeList = ', LikedMeList);
    if (LikedMeList.includes(likedUser))
        console.log('INFO: its a match');
}

export async function saveAdditionalInfo( occupation, desireMatch) {
    const userId = auth.currentUser.uid;
    await updateDoc(doc(db, 'users', userId), {
        occupation: occupation,
        desireMatch: desireMatch
    }).then(() => console.log('INFO: User data updated successfully'))
        .catch((error) => console.error('WARNING: Error updating user data:', error))
}