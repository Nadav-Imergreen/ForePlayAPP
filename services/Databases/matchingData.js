import { auth, db } from '../config';
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where, addDoc } from 'firebase/firestore';
import { getCurrentUser, getUser } from './users';

export async function getMatchingData() {
    try {
        const col = collection(db, "matchingData");
        const q = query(col, where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
        throw new Error("WARNING: matchingData docs not found!");
    }
}

export async function getMatchTables() {
    try {
        const userId = auth.currentUser.uid;
        const docRef = doc(db, "matchingData", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            throw new Error("WARNING: Doc not found!");
        }
    } catch (error) {
        throw new Error("WARNING: Doc not found!");
    }
}

export async function saveLike(uid) {
    const currentUserUid = auth.currentUser.uid;
    const matchingDataRef = doc(db, 'matchingData', currentUserUid);

    try {
        const currentUserData = await getCurrentUser();
        const likedUser = await getUser(uid);

        const docSnap = await getDoc(matchingDataRef);
        let likedUsers = [];

        if (docSnap.exists()) {
            const data = docSnap.data();
            likedUsers = data.likedUsers ? data.likedUsers : [];
        }

        const alreadyLiked = likedUsers.some(obj => Object.values(obj).includes(uid));
        const updatedLikedUsers = alreadyLiked ? likedUsers : [...likedUsers, { [likedUser.firstName]: uid }];

        if (docSnap.exists()) {
            await updateDoc(matchingDataRef, { likedUsers: updatedLikedUsers });
        } else {
            await setDoc(matchingDataRef, { likedUsers: updatedLikedUsers, userId: currentUserUid });
        }

        console.log('INFO: New like saved successfully');
    } catch (error) {
        console.error('ERROR: Failed to save new like:', error.message);
    }
}

export async function saveSeen(uid) {
    const currentUserUid = auth.currentUser.uid;
    const matchingDataRef = doc(db, 'matchingData', currentUserUid);

    try {
        const currentUserData = await getCurrentUser();
        const seenUser = await getUser(uid);

        const docSnap = await getDoc(matchingDataRef);
        let seenUsers = [];

        if (docSnap.exists()) {
            const data = docSnap.data();
            seenUsers = data.seenUsers ? data.seenUsers : [];
        }

        const alreadySeen = seenUsers.some(obj => Object.values(obj).includes(uid));
        const updatedSeenUsers = alreadySeen ? seenUsers : [...seenUsers, { [seenUser.firstName]: uid }];

        if (docSnap.exists()) {
            await updateDoc(matchingDataRef, { seenUsers: updatedSeenUsers });
        } else {
            await setDoc(matchingDataRef, { seenUsers: updatedSeenUsers, userId: currentUserUid });
        }

        console.log('INFO: Seen user saved successfully');
    } catch (error) {
        console.error('ERROR: Failed to save seen user:', error.message);
    }
}

export async function saveLikeMe(uid) {
    const matchingDataRef = doc(db, 'matchingData', uid);

    try {
        const currentUser = await getCurrentUser();

        const docSnap = await getDoc(matchingDataRef);
        let likedMeUsers = [];

        if (docSnap.exists()) {
            const data = docSnap.data();
            likedMeUsers = data.likedMeUsers ? data.likedMeUsers : [];
        }

        const userAlreadyLiked = likedMeUsers.some(entry => Object.values(entry).includes(auth.currentUser.uid));
        const updatedLikedMeList = userAlreadyLiked ? likedMeUsers : [...likedMeUsers, { [currentUser.firstName]: auth.currentUser.uid }];

        if (docSnap.exists()) {
            await updateDoc(matchingDataRef, { likedMeUsers: updatedLikedMeList });
        } else {
            await setDoc(matchingDataRef, { likedMeUsers: updatedLikedMeList, userId: uid });
        }

        console.log('INFO: New likeMe saved successfully');
    } catch (error) {
        console.error('ERROR: Failed to save new likeMe:', error.message);
    }
}

export async function checkForMatch(likedUser) {
    console.log('checkForMatch');

    const matchingDataRef = doc(db, 'matchingData', auth.currentUser.uid);
    const docSnap = await getDoc(matchingDataRef);
    let LikedMeList = [];

    if (docSnap.exists()) {
        const data = docSnap.data();
        LikedMeList = data.likedMeUsers ? data.likedMeUsers : [];
    }
    
    for (const obj of LikedMeList) {
        if (Object.values(obj).includes(likedUser)) {
            console.log('INFO: it\'s a match');
            return true;
        }
    }

    console.log('INFO: it\'s not a match');
    return false;
}