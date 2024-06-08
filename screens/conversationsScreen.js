import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { auth } from '../services/config';
import { handleSignOut } from "../services/auth";
import {registerAndSaveConversation, registerAndSaveMessages, registerAndSaveUsers} from '../services/insertFakeUsers';
import { getUserConversations } from "../services/firebaseDatabase";
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
                <TouchableOpacity onPress={() => registerAndSaveUsers(userProfiles)}>
                    <Text style={styles.logoutText}>Write users</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => registerAndSaveConversation(hardCodedConversations)}>
                    <Text style={styles.logoutText}>Write conversations</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => registerAndSaveMessages(hardCodedMessages)}>
                    <Text style={styles.logoutText}>Write messages</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSignOut}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
    },
    logoutContainer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        padding: 10
    },
    logoutText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        borderRadius: 12,
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: '#a4cdbd',
        textAlign: 'center',
        width: '100%',
        padding: 10,
    },
});

export default ConversationsScreen;
