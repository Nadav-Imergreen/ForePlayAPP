import { auth, db } from '../services/config';
import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, orderBy, onSnapshot, where, getDoc, doc } from 'firebase/firestore';
import { getCurrentUser } from "../services/Databases/users";
import { createMassage } from "../services/Databases/chat";
import { aiMessageGenerator } from "../services/matchAI";

const ChatScreen = ({ navigation, route }) => {
    const { conversationID } = route.params;
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [aiSuggestion, setAiSuggestion] = useState(''); // State to hold AI suggestion

    useLayoutEffect(() => {
        const q = query(
            collection(db, 'messages'),
            where('conversationId', '==', conversationID),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({
                _id: doc.id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().user,
                conversationId: doc.data().conversationId
            })));
            setLoadingMessages(false);
        });

        return () => {
            unsubscribe();
        };
    }, [navigation, conversationID]);

    useEffect(() => {
        const getUserImage = async () => {
            const currentUser = await getCurrentUser();
            return currentUser.images[0];
        };

        getUserImage()
            .then((url) => setAvatarUrl(url))
            .catch((err) => console.error("WARNING: error fetch user image: ", err));
    }, []);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        const { _id, createdAt, text, user } = messages[0];

        const data = { id: _id, createdAt, text, user, conversationId: conversationID };
        console.log('Creating message with data:', data);
        createMassage(data);
    }, [conversationID]);

    const generateMessage = async () => {
        const conversationDoc = await getDoc(doc(db, 'conversations', conversationID));
        const usersId = conversationDoc.data().members;

        const messagesText = messages.reverse().map(msg => `user ${msg.user._id}: "${msg.text}"`).join('. ');
        const aiSuggestion = await aiMessageGenerator(usersId[0], usersId[1], messagesText);
        setAiSuggestion(aiSuggestion); // Set AI suggestion
    };

    const useSuggestion = () => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, [{
            _id: new Date().getTime().toString(),
            text: aiSuggestion,
            createdAt: new Date().getTime(),
            user: {
                _id: auth?.currentUser?.uid,
                name: auth?.currentUser?.email || 'User',
                avatar: avatarUrl
            },
            conversationId: conversationID
        }]));

        const { _id, createdAt, text, user } = messages[0];

        const data = { id: _id, createdAt, text, user, conversationId: conversationID };
        console.log('Creating message with data:', data);
        createMassage(data);

        setAiSuggestion(''); // Clear AI suggestion after use
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Button title="Generate Message" onPress={generateMessage}/>
                {aiSuggestion !== '' && (
                    <View style={styles.aiSuggestionContainer}>
                        <Text style={styles.aiSuggestionText}>{aiSuggestion}</Text>
                        <TouchableOpacity style={styles.useSuggestionButton} onPress={useSuggestion}>
                            <Text style={styles.useSuggestionButtonText}>Use Suggestion</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {loadingMessages ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                ) : (
                    <>
                        {messages.length === 0 && (
                            <View style={styles.noMessagesContainer}>
                                <Text style={styles.noMessagesText}>No messages yet</Text>
                            </View>
                        )}
                        <GiftedChat
                            messages={messages}
                            onSend={messages => onSend(messages)}
                            placeholder='Write a message...'
                            user={{
                                _id: auth?.currentUser?.uid,
                                name: auth?.currentUser?.email || 'User',
                                avatar: avatarUrl
                            }}
                            showUserAvatar={true}
                            alwaysShowSend={true}
                        />
                    </>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    loadingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    noMessagesContainer: {
        position: 'absolute',
        top: 0,
        bottom: 60, // Adjust this value if the input toolbar overlaps
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    noMessagesText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    aiSuggestionContainer: {
        padding: 10,
        margin: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        alignItems: 'center',
    },
    aiSuggestionText: {
        fontSize: 16,
        marginBottom: 10,
    },
    useSuggestionButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
    },
    useSuggestionButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ChatScreen;