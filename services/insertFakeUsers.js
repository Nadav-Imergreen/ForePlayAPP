import { auth, db } from './config'; // Make sure you have firebase configured and imported
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import axios from 'axios';
import {createConversation, createMassage, getUser} from "./firebaseDatabase";


export const signup = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export async function saveUserInfo(userId, data) {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, data)
        .then(() => console.log('INFO: User data updated successfully'))
        .catch((error) => console.error('WARNING: Error updating user data:', error));
}

export async function fetchRandomPhotos(gender) {
    try {
        const response1 = await axios.get(`https://randomuser.me/api/?gender=${gender}`);
        const response2 = await axios.get(`https://randomuser.me/api/?gender=${gender}`);
        
        const photoUrl1 = response1.data.results[0].picture.large;
        const photoUrl2 = response2.data.results[0].picture.large;
        
        return [photoUrl1, photoUrl2];
    } catch (error) {
        console.error('ERROR: Failed to fetch random photos:', error);
        return [null, null];
    }
}

export async function registerAndSaveUsers(userList) {
    for (let user of userList) {
        try {
            // Register user with Firebase Auth
            const registeredUser = await signup(user.email, user.password);

            // Fetch a random photo
            const photoUrl = await fetchRandomPhotos(user.sex);
            
            // Prepare data to be saved (excluding password)
            const userData = {
                userId: registeredUser.uid,
                firstName: user.firstName,
                lastName: user.lastName,
                age: user.age,
                sex: user.sex,
                hometown: user.hometown,
                occupation: user.occupation,
                desireMatch: user.desireMatch,
                aboutMe: user.aboutMe,
                partner_gender: user.partner_gender,
                preferredAgeRange: user.preferredAgeRange,
                radius: user.radius,
                location: user.location,
                email: user.email,
                images: photoUrl ? photoUrl : ['https://via.placeholder.com/200'] // Fallback photo URL
            };

            // Save user info to Firestore
            await saveUserInfo(registeredUser.uid, userData);

            console.log(`INFO: User ${user.firstName} ${user.lastName} registered and data saved successfully.`);
        } catch (error) {
            console.error(`WARNING: Error registering or saving data for user ${user.firstName} ${user.lastName}:`, error.message);
        }
    }
}

export async function registerAndSaveConversation(conversationList) {
    for (let conversation of conversationList) {

        const [user1, user2] = conversation.members;
        const firstUser = auth.currentUser.uid;
        const secondUser = user1 === firstUser ? user2 : user1;

        await createConversation(secondUser);
    }
}

export async function registerAndSaveMessages(messagesList) {
    for (let message of messagesList) {
        await createMassage(message);
    }
}