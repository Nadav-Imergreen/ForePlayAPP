import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, db } from '../services/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import {handleSignOut} from "../services/auth";


import { registerAndSaveUsers } from '../services/insertFakeUsers';

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
        const otherUser = item.members.find(member => member !== auth.currentUser.uid);
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

    const userProfiles = [
        {
            firstName: "John",
            lastName: "Doe",
            age: "29",
            sex: "Male",
            hometown: "New York",
            occupation: "Engineer",
            desireMatch: "Someone who loves adventure",
            aboutMe: "Loves to travel and explore new places. Avid reader and coffee enthusiast.",
            email: "johndoe@gmail.com",
            password: "123456",
            partner_gender: "Female",
            preferredAgeRange: [25, 35],
            radius: 50,
            location: { latitude: 32.0853, longitude: 34.7818 } // Example coordinates in Israel
        },
        {
            firstName: "Jane",
            lastName: "Mary",
            age: "25",
            sex: "Female",
            hometown: "Los Angeles",
            occupation: "Designer",
            desireMatch: "Someone creative and fun",
            aboutMe: "Enjoys hiking and outdoor adventures. Passionate about cooking and trying new recipes.",
            email: "janemary@gmail.com",
            password: "123456",
            partner_gender: "Male",
            preferredAgeRange: [28, 40],
            radius: 30,
            location: { latitude: 31.7683, longitude: 35.2137 } // Example coordinates in Israel
        },
        {
            firstName: "Sarah",
            lastName: "Levi",
            age: "27",
            sex: "Female",
            hometown: "Tel Aviv",
            occupation: "Marketing Specialist",
            desireMatch: "Someone who loves sports",
            aboutMe: "Fitness enthusiast and marathon runner. Enjoys cooking healthy meals.",
            email: "sarahlevi@gmail.com",
            password: "123456",
            partner_gender: "Male",
            preferredAgeRange: [27, 35],
            radius: 40,
            location: { latitude: 32.0853, longitude: 34.7818 } // Tel Aviv coordinates
        },
        {
            firstName: "Rachel",
            lastName: "Cohen",
            age: "30",
            sex: "Female",
            hometown: "Jerusalem",
            occupation: "Teacher",
            desireMatch: "Someone caring and thoughtful",
            aboutMe: "Loves teaching children and making a difference. Enjoys painting in her free time.",
            email: "rachelcohen@gmail.com",
            password: "123456",
            partner_gender: "Male",
            preferredAgeRange: [30, 40],
            radius: 50,
            location: { latitude: 31.7683, longitude: 35.2137 } // Jerusalem coordinates
        },
        {
            firstName: "Maya",
            lastName: "Shapira",
            age: "24",
            sex: "Female",
            hometown: "Haifa",
            occupation: "Nurse",
            desireMatch: "Someone compassionate",
            aboutMe: "Dedicated to helping others. Enjoys hiking and exploring nature trails.",
            email: "mayashapira@gmail.com",
            password: "123456",
            partner_gender: "Male",
            preferredAgeRange: [24, 32],
            radius: 60,
            location: { latitude: 32.7940, longitude: 34.9896 } // Haifa coordinates
        },
        {
            firstName: "Noa",
            lastName: "Bar",
            age: "26",
            sex: "Female",
            hometown: "Eilat",
            occupation: "Diver",
            desireMatch: "Someone adventurous",
            aboutMe: "Loves the sea and underwater exploration. Passionate about marine life conservation.",
            email: "noabar@gmail.com",
            password: "123456",
            partner_gender: "Male",
            preferredAgeRange: [26, 34],
            radius: 70,
            location: { latitude: 29.5577, longitude: 34.9519 } // Eilat coordinates
        },
    ];

    return (
    <View style={{flex: 1}}>
        <FlatList
            data={conversations}
            keyExtractor={item => item.id}
            renderItem={renderConversationItem}
            contentContainerStyle={styles.container}
        />
        <View style={styles.logoutContainer}>
            <TouchableOpacity onPress={() => registerAndSaveUsers(userProfiles)}>
                <Text style={styles.logoutText}>Write users</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignOut}>
                <Text style={styles.logoutText}>logout</Text>
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
