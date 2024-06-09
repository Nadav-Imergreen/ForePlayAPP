import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { auth } from '../services/config';
import { handleSignOut } from "../services/auth";
import {registerAndSaveConversation, registerAndSaveMessages, registerAndSaveUsers} from '../services/insertFakeUsers';
import { getUserConversations } from "../services/Databases/chat";
import ConversationItem from '../components/conversationItem';
import {hardCodedConversations, hardCodedMessages, userProfiles} from "../services/hardCodedData";

const ConversationsScreen = ({ navigation }) => {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const fetchConversations = async () => {
            const currentUserId = auth.currentUser.uid;
            const querySnapshot = await getUserConversations(currentUserId);

            const convos = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setConversations(convos);
        };

        fetchConversations();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={conversations}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ConversationItem item={item} navigation={navigation} />
                )}
                contentContainerStyle={styles.container}
            />
            <View style={styles.logoutContainer}>
                
                {/* 
                <TouchableOpacity onPress={() => registerAndSaveUsers(userProfiles)}>
                    <Text style={styles.logoutText}>Write users</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => registerAndSaveConversation(hardCodedConversations)}>
                    <Text style={styles.logoutText}>Write conversations</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => registerAndSaveMessages(hardCodedMessages)}>
                    <Text style={styles.logoutText}>Write messages</Text>
                </TouchableOpacity>
                */}
                <TouchableOpacity style={styles.logoutbutton} onPress={handleSignOut}>
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
