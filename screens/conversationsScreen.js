import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { auth, db } from '../services/config';
import { handleSignOut } from "../services/auth";
import ConversationItem from '../components/conversationItem';
import { collection, onSnapshot, query, where } from "firebase/firestore";

const ConversationsScreen = ({ navigation, route }) => {
    const [conversations, setConversations] = useState([]);
    const { conversationId } = route.params || {};

    /*
    useEffect(() => {
        if (conversationId){
            navigation.navigate('Chat', { conversationID: conversationId });
        }
    }, []);
    */
   
    useEffect(() => {
        const fetchConversations = async () => {

            // Get all conversations that the active user is a part of
            const conversationRef = collection(db, 'conversations');
            const q = query(conversationRef, where('members', 'array-contains', auth.currentUser.uid));

            // Extract data from query and set a real-time DB alert
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const convos = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setConversations(convos);
            });

            return () => {
                unsubscribe();
            };
        };

        fetchConversations().catch((e) => console.log('WARNING: error loading user conversations: ', e));
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
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
});

export default ConversationsScreen;
