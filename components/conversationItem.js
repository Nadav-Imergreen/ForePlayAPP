import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../services/config';
import { getUser } from "../services/Databases/users";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

const ConversationItem = ({ item, navigation }) => {
    const [secondUserProfile, setSecondUserProfile] = useState(null);

    useEffect(() => {
        const fetchSecondUserProfile = async () => {
            const [user1, user2] = item.members;
            const firstUser = auth.currentUser.uid;
            const secondUser = user1 === firstUser ? user2 : user1;
            return await getUser(secondUser);
        };

        fetchSecondUserProfile().then((p) => setSecondUserProfile(p));
    }, [item]);

    const handlePress = async () => {
        const conversationDocRef = doc(db, 'conversations', item.id);
        await updateDoc(conversationDocRef, {
            openedBy: arrayUnion(auth.currentUser.uid)
        });

        navigation.navigate('Chat', { conversationID: item.id });
    };

    const isNew = !item.openedBy || !item.openedBy.includes(auth.currentUser.uid);

    if (!secondUserProfile) {
        return <Text>Loading...</Text>;
    }

    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={styles.conversationItem}>
                <Image
                    source={{ uri: secondUserProfile.images[0] }}
                    style={styles.avatar}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.username}>{secondUserProfile.firstName}</Text>
                </View>
                <Text style={styles.time}>{new Date(item.createdAt.seconds * 1000).toLocaleTimeString()}</Text>
                {isNew && <View style={styles.newIndicator} />}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    conversationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    username: {
        fontWeight: 'bold',
    },
    additionalInfo: {
        color: '#666',
    },
    time: {
        marginLeft: 10,
        color: '#666',
    },
    newIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'red',
        marginLeft: 10,
    },
});

export default ConversationItem;
