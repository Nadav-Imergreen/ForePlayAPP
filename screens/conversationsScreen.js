import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, db } from '../services/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ConversationsScreen = ({ navigation }) => {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const fetchConversations = async () => {
            const currentUserId = auth.currentUser.uid;
            const conversationsRef = collection(db, 'conversations');
            const q = query(conversationsRef, where('members', 'array-contains', currentUserId));
            const querySnapshot = await getDocs(q);

            const convos = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log('querySnapshot length: ', querySnapshot.docs.length);
            setConversations(convos);
        };

        fetchConversations();
    }, []);

    const renderConversationItem = ({ item }) => {
        console.log('item uid: ', item.id);
        return (
            <TouchableOpacity onPress={() => navigation.navigate('Chat', { conversationID: item.id })}>
                <View style={styles.conversationItem}>
                    <Image
                        source={{ uri: item.conversationPic }}
                        style={styles.avatar}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.username}>{item.conversationName}</Text>
                    </View>
                    <Text style={styles.time}>{new Date(item.createdAt.seconds * 1000).toLocaleTimeString()}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={conversations}
            keyExtractor={item => item.id}
            renderItem={renderConversationItem}
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
    },
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
    lastMessage: {
        color: '#666',
    },
    time: {
        marginLeft: 10,
        color: '#666',
    },
});

export default ConversationsScreen;
