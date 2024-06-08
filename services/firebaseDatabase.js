// //firebaseDatabase.js
// import {auth, db, storage} from './config';
// import {
//     collection,
//     doc,
//     getDoc,
//     getDocs,
//     query,
//     setDoc,
//     updateDoc,
//     where,
//     serverTimestamp,
//     addDoc
// } from 'firebase/firestore';
// import {getDownloadURL, ref as storageRef, uploadBytes} from 'firebase/storage';
// import {deleteUserAccount} from "./auth";
//
// export async function saveUser(userId, email) {
//
//     // check if user exist in database - skip this function
//     const userData = await getCurrentUser();
//     if (userData) {
//         console.log('INFO: User', email, 'already exists in Firestore');
//         return;
//     }
//     const data = {
//         userId: userId,
//         email: email,
//     };
//     // Reference to the 'users' collection
//     const usersRef = collection(db, 'users');
//     await setDoc(doc(usersRef, userId), data)
//         .then(() => console.log('INFO: User', email, 'saved to Firestore'))
//         .catch((error) => {
//             console.error('WARNING: Error saving user to Firestore:', error);
//             deleteUserAccount();
//             alert('WARNING: User not registered, due to error in saving user info to database');
//         });
// }
//
// export async function saveUserInfo(data) {
//     // Update the document with the new user information
//     const userId = auth.currentUser.uid;
//     const userDocRef = doc(db, 'users', userId);
//     await updateDoc(userDocRef, data)
//         .then(() => console.log('INFO: User data updated successfully'))
//         .catch((error) => console.error('WARNING: Error updating user data:', error))
// }
//
// export async function saveUserPreferences(gender, ageRange, radius, location) {
//     // Update the document with the new user preferences
//     const userId = auth.currentUser.uid;
//     await updateDoc(doc(db, 'users', userId), {
//         partner_gender: gender,
//         preferredAgeRange: ageRange,
//         radius: radius,
//         location: location
//     })
//         .then(() => console.log('INFO: User preferences updated successfully'))
//         .catch((error) => console.error('WARNING: Error updating user preferences:', error));
// }
//
//
// export async function saveExtraInfo(aboutMe, desireMatch) {
//     // Update the document with the new user preferences
//     const userId = auth.currentUser.uid;
//     await updateDoc(doc(db, 'users', userId), {
//         aboutMe: aboutMe,
//         desireMatch: desireMatch
//     })
//         .then(() => console.log('INFO: User extra info updated successfully'))
//         .catch((error) => console.error('WARNING: Error updating user extra info:', error));
// }
//
// export async function saveUserLocation(location) {
//     try {
//         // Get the current user's ID
//         const userId = auth.currentUser.uid;
//
//         // Reference to the user document
//         const userDocRef = doc(db, 'users', userId);
//
//         // Update the user document with the provided location
//         await updateDoc(userDocRef, {location: location});
//
//         console.log('INFO: User location saved successfully');
//     } catch (error) {
//         console.error('ERROR: Failed to save user location:', error.message);
//     }
// }
//
// export async function getCurrentUser() {
//     try {
//         const userId = auth.currentUser.uid;
//         const docRef = doc(db, "users", userId);
//         const docSnap = await getDoc(docRef);
//         return docSnap.data();
//     } catch {
//         throw Error("WARNING: users doc not found!")
//     }
// }
//
// export async function getMatchingData() {
//     try {
//         const  col = collection(db, "matchingData");
//         const q = query(col, where("userId", "==", auth.currentUser.uid));
//         return await getDocs(q);
//     } catch {
//         throw Error("WARNING: matchingData docs not found!")
//     }
// }
//
// export async function getMatchTables() {
//     try {
//         const userId = auth.currentUser.uid;
//         const docRef = doc(db, "matchingData", userId);
//         const docSnap = await getDoc(docRef);
//         return docSnap.data();
//     } catch {
//         throw Error("WARNING: Doc not found!")
//     }
// }
//
//
// export async function getUser(uid) {
//     try {
//         const docRef = doc(db, "users", uid);
//         const docSnap = await getDoc(docRef);
//         return docSnap.data();
//     } catch {
//         throw Error("WARNING: Doc not found!")
//     }
// }
//
// export async function getAllUsers(gender) {
//     try {
//         const coll = collection(db, "users");
//         const q = query(coll, where("sex", "!=", gender));
//         return await getDocs(q);
//     } catch {
//         throw Error("WARNING: Docs not found!")
//     }
// }
//
// export async function getUsersBy(user) {
//     try {
//         const minAge = user.preferredAgeRange[0].toString();
//         const maxAge = user.preferredAgeRange[1].toString();
//         const defaultGender = user.sex === 'male' ? 'female' : 'male';
//         const coll = collection(db, "users");
//         const q = query(coll,
//             where("sex", "==", user.partner_gender ? user.partner_gender : defaultGender),
//             where('age', '<=', maxAge ? maxAge : (user.age + 7)),
//             where('age', '>=', minAge ? minAge : user.age / 2 + 7));
//         return await getDocs(q);
//     } catch (error) {
//         throw new Error("WARNING: Error retrieving documents: " + error.message);
//     }
// }
//
// export async function uploadImageToStorage(imageUrl) {
//     try {
//         const imageRef = storageRef(storage, `images/${imageUrl}`);
//         const blob = await fetch(imageUrl).then((res) => {
//             if (!res.ok) {
//                 throw new Error('Failed to fetch image');
//             }
//             return res.blob();
//         });
//
//         const snapshot = await uploadBytes(imageRef, blob);
//         return await getDownloadURL(snapshot.ref);
//     } catch (error) {
//         console.error('Error uploading image to storage:', error.message);
//         throw error; // Propagate the error to the caller
//     }
// };
//
// export async function deletePhoto(index) {
//     const userId = auth.currentUser.uid; // Get the current user's ID
//     const userDocRef = doc(db, 'users', userId); // Reference to the user document
//
//     try {
//         // Get the existing images array from the user document
//         const userDoc = await getDoc(userDocRef);
//         const existingUrls = userDoc.data().images || [];
//
//         // Remove the URL at the specified index
//         const updatedUrls = existingUrls.filter((_, i) => i !== index);
//
//         // Update the user document with the updated image URLs
//         await updateDoc(userDocRef, {images: updatedUrls});
//         console.log('INFO: Image URL deleted successfully');
//     } catch (error) {
//         console.error('ERROR: Failed to delete image URL:', error.message);
//     }
// }
//
// export async function saveUrl(url) {
//
//     const userId = auth.currentUser.uid; // Get the current user's ID
//     const userDocRef = doc(db, 'users', userId); // Reference to the user document
//
//     try {
//         // Get the current user's data
//         const userData = await getCurrentUser();
//
//         // Get the existing images array from the user data
//         const existingUrls = userData.images || [];
//
//         // Append the new URL to the existing URLs
//         const updatedUrls = [...existingUrls, url];
//
//         // Update the user document with the updated image URLs
//         await updateDoc(userDocRef, {images: updatedUrls});
//         console.log('INFO: Image URL saved successfully');
//     } catch (error) {
//         console.error('ERROR: Failed to save image URL:', error.message);
//     }
// }
//
// export async function saveLike(uid) {
//     const currentUser = auth.currentUser.uid;
//     const matchingDataRef = doc(db, 'matchingData', currentUser);
//     const currentUserRef = doc(db, 'users', currentUser);
//
//     try {
//         // Get the current user's data
//         const currentUserData = await getCurrentUser();
//         const likedUser = await getUser(uid);
//
//         // Get the existing liked users array from the current user's data
//         const likedUsers = currentUserData.likedUsers || [];
//
//         // Check if the liked user's UID already exists in any of the objects in the likedUsers array
//         const alreadyLiked = likedUsers.some(obj => Object.values(obj).includes(uid));
//
//         // Append the new liked user if it's not already present
//         const updatedLikedUsers = alreadyLiked ? likedUsers : [...likedUsers, { [likedUser.firstName]: uid }];
//
//         // Update the user document with the updated liked users list
//         await updateDoc(currentUserRef, { likedUsers: updatedLikedUsers });
//
//         console.log('INFO: New like saved successfully');
//     } catch (error) {
//         console.error('ERROR: Failed to save new like:', error.message);
//     }
// }
//
// export async function saveSeen(uid) {
//     const matchingDataRef = collection(db, 'matchingData');
//
//     try {
//         // Get the current user's data
//         const currentUserData = await getCurrentUser();
//         const seenUser = await getUser(uid);
//
//         // Get the existing seen users array from the current user's data
//         const seenUsers = currentUserData.seenUsers || [];
//
//         // Check if the seen user's UID already exists in the seenUsers array
//         const alreadySeen = seenUsers.some(obj => Object.values(obj).includes(uid));
//
//         // Append the new seen user if it's not already present
//         const updatedSeenUsers = alreadySeen ? seenUsers : [...seenUsers, { [seenUser.firstName]: uid }];
//
//         // Create a new document or update the existing one
//         await addDoc(matchingDataRef, { seenUsers: updatedSeenUsers, userId: auth.currentUser.uid })
//             .then(() => console.log('matchingData saved'))
//             .catch((error) => console.error('WARNING: error in save matchingData: ', error));
//
//         console.log('INFO: Seen user saved successfully');
//     } catch (error) {
//         console.error('ERROR: Failed to save seen user:', error.message);
//     }
// }
//
// export async function saveLikeMe(uid) {
//     const matchingDataRef = doc(db, 'matchingData', uid);
//
//     try {
//         const likedUser = await getUser(uid);
//         const currentUser = await getCurrentUser();
//
//         const likedUserDoc = await getDoc(matchingDataRef);
//
//         if (!likedUserDoc.exists()) {
//             // If the document does not exist, create it with the initial likedMeUsers field
//             await setDoc(matchingDataRef, {
//                 likedMeUsers: [{ [currentUser.firstName]: auth.currentUser.uid }],
//                 userId: uid
//             });
//             console.log('INFO: new likeMe saved successfully (created new document)');
//         } else {
//             // If the document exists, update it
//             const likedMeList = likedUserDoc.data().likedMeUsers || [];
//
//             // Check if the current user's UID is already in the likedMeList
//             const userAlreadyLiked = likedMeList.some(entry => Object.values(entry).includes(auth.currentUser.uid));
//
//             // Only add the current user if they are not already in the likedMeList
//             const updatedLikedMeList = userAlreadyLiked ? likedMeList : [...likedMeList, { [currentUser.firstName]: auth.currentUser.uid }];
//
//             await updateDoc(matchingDataRef, { likedMeUsers: updatedLikedMeList });
//             console.log('INFO: new likeMe saved successfully');
//         }
//     } catch (error) {
//         console.error('ERROR: Failed to save new like:', error.message);
//     }
// }
//
// export async function checkForMatch(likedUser) {
//     console.log('checkForMatch');
//     const currentUser = await getCurrentUser();
//     const LikedMeList = currentUser.likedMeUsers || [];
//
//     // Iterate over each object in the LikedMeList array
//     for (const obj of LikedMeList) {
//         // Check if the values of the object match the likedUser
//         if (Object.values(obj).includes(likedUser)) {
//             console.log('INFO: it\'s a match');
//             return true;
//         }
//     }
//
//     console.log('INFO: it\'s not a match');
//     return false;
// }
//
//
// export const createConversation = async (secondUserId) => {
//     const currentUserId = auth.currentUser.uid;
//
//     try {
//         // Check if a conversation already exists between the two users
//         const docs = await getUserConversations(currentUserId);
//         let existingConversation = null;
//         docs.forEach(doc => {
//             const data = doc.data();
//             if (data.members.includes(secondUserId)) {
//                 existingConversation = doc;
//             }
//         });
//
//         if (existingConversation) {
//             console.log('Conversation already exists with ID: ', existingConversation.id);
//             return existingConversation.id;
//         }
//
//         // Create a new conversation with the two members and the current date
//         const conversationRef = collection(db, 'conversations');
//         const docRef = await addDoc(conversationRef, {
//             members: [currentUserId, secondUserId],
//             createdAt: serverTimestamp(),
//         });
//
//         console.log('Conversation saved with ID: ', docRef.id);
//         return docRef.id;
//     } catch (error) {
//         console.error('WARNING: error in save conversation ID: ', error);
//         throw error;
//     }
// };
//
// export const getUserConversations = async (userId) => {
//     const conversationRef = collection(db, 'conversations');
//     const q = query(conversationRef, where('members', 'array-contains', userId));
//     return await getDocs(q);
// }
//
// export const createMassage = async (data) => {
//     // Create a new conversation with the two members and the current date
//     const massagesRef = collection(db, 'messages');
//     await addDoc(massagesRef, data)
//         .then((mid) => console.log('massage saved with ID: ', mid.id))
//         .catch((error) => console.error('WARNING: error in save massage: ', error));
// };
//
// // Function to get messages text for a given user
// export async function getUserMessages(userId) {
//
//     const messagesRef = collection(db, 'messages');
//     try {
//         // Create a query against the collection
//         const q = query(messagesRef, where("user._id", "==", userId));
//         const querySnapshot = await getDocs(q);
//
//         // Extract the message texts from the query results
//         return querySnapshot.docs.map(doc => ({
//             text: doc.data().text,
//         }));
//     } catch (error) {
//         console.error('ERROR: Failed to retrieve messages:', error.message);
//         return [];
//     }
// }
//
// export const saveAiProfile = async (id, userProfile) => {
//     // Update the document with profile build by AI
//     await updateDoc(doc(db, 'users', id), {
//         aiProfile: userProfile
//     })
//         .then(() => console.log('INFO: User preferences updated successfully with ai profile'))
//         .catch((error) => console.error('WARNING: Error updating user preferences with ai profile:', error));
// }
