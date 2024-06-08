import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {auth} from '../services/config';
import {getUser} from "../services/firebaseDatabase";

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

    if (!secondUserProfile) {
        return <Text>Loading...</Text>;
    }

    return (
        <TouchableOpacity onPress={() => navigation.navigate('Chat', { conversationID: item.id })}>
            <View style={styles.conversationItem}>
                <Image
                    source={{ uri: secondUserProfile.images[0]}}
                    style={styles.avatar}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.username}>{secondUserProfile.firstName}</Text>
                </View>
                <Text style={styles.time}>{new Date(item.createdAt.seconds * 1000).toLocaleTimeString()}</Text>
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
});

export default ConversationItem;
