import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { auth, db } from '../services/config';
import { handleSignOut } from "../services/auth";
import ConversationItem from '../components/conversationItem';
import { collection, onSnapshot, query, where } from "firebase/firestore";

const ConversationsScreen = ({ navigation }) => {
    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            // Get all conversations that the active user is a part of
            const conversationRef = collection(db, 'conversations');
            const q = query(conversationRef, where('members', 'array-contains', auth.currentUser.uid));

            // Extract data from query and set a real-time DB alert
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const conv = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setConversations(conv);
                setIsLoading(false);
            });

            return () => {
                unsubscribe();
            };
        };

        fetchConversations().catch((e) => {
            console.log('WARNING: error loading user conversations: ', e);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#a4cdbd" />
                <Text>Loading conversations...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {conversations.length === 0 && (
                <View style={styles.noConversationsContainer}>
                    <Text style={styles.noConversationsText}>No conversations yet</Text>
                </View>
            )}
            <FlatList
                data={conversations}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ConversationItem item={item} navigation={navigation} />
                )}
                contentContainerStyle={styles.container}
            />
            <View style={styles.logoutContainer}>
                <TouchableOpacity onPress={handleSignOut}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoutContainer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        padding: 10
    },
    logoutbutton: {
        borderRadius: 40
    },
    logoutText: {
        fontSize: 18,
        fontWeight: 'bold',
        borderColor: 'lightgrey',
        borderWidth: 1,
        backgroundColor: 'white',
        color: '#a4cdbd',
        textAlign: 'center',
        width: '100%',
        padding: 10,
        borderRadius: 30,
        elevation: 3
    },
    noConversationsContainer: {
        position: 'absolute',
        top: 0,
        bottom: 60, // Adjust this value if the input toolbar overlaps
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    noConversationsText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
});

export default ConversationsScreen;
