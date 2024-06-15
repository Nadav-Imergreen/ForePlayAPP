//firebaseDatabase.js
import {auth, db} from '../config';
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    arrayUnion,
    query,
    where,
    serverTimestamp,
    addDoc, arrayUnion
} from 'firebase/firestore';


export const createConversation = async (secondUserId) => {
    const currentUserId = auth.currentUser.uid;

    try {
        // Check if a conversation already exists between the two users
        const docs = await getUserConversations(currentUserId);
        let existingConversation = null;
        docs.forEach(doc => {
            const data = doc.data();
            if (data.members.includes(secondUserId)) {
                existingConversation = doc;
            }
        });

        if (existingConversation) {
            console.log('INFO: Conversation already exists with ID: ', existingConversation.id);
            return existingConversation.id;
        }

        // Create a new conversation with the two members and the current date
        const conversationRef = collection(db, 'conversations');
        const docRef = await addDoc(conversationRef, {
            members: [currentUserId, secondUserId],
            createdAt: serverTimestamp(),
        });

        console.log('INFO: Conversation saved with ID: ', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('WARNING: error in save conversation ID: ', error);
        throw error;
    }
};

export const getUserConversations = async (userId) => {
    const conversationRef = collection(db, 'conversations');
    const q = query(conversationRef, where('members', 'array-contains', userId));
    return await getDocs(q);
}

export const createMassage = async (data) => {
    // Create a new conversation with the two members and the current date
    const massagesRef = collection(db, 'messages');
    await addDoc(massagesRef, data)
        .then((mid) => console.log('massage saved with ID: ', mid.id))
        .catch((error) => console.error('WARNING: error in save massage: ', error));
};

// Function to get messages text for a given user
export async function getUserMessages(userId) {

    const messagesRef = collection(db, 'messages');
    try {
        // Create a query against the collection
        const q = query(messagesRef, where("user._id", "==", userId));
        const querySnapshot = await getDocs(q);

        // Extract the message texts from the query results
        return querySnapshot.docs.map(doc => ({
            text: doc.data().text,
        }));
    } catch (error) {
        console.error('ERROR: Failed to retrieve messages:', error.message);
        return [];
    }
}

export async function updateConversationOpened(conversationId) {
    try {
        const conversationDocRef = doc(db, 'conversations', conversationId);
        await updateDoc(conversationDocRef, {
            openedBy: arrayUnion(auth.currentUser.uid)
        });
        console.log('Conversation successfully updated as opened');
    } catch (error) {
        console.error('Error updating conversation as opened: ', error);
    }
}