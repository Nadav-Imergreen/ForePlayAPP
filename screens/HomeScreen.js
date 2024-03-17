import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { getDocs, collection, query, where } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../services/config'; // Import Firestore configuration

const HomeScreen = () => {
    const [suggestedUsers, setSuggestedUsers] = useState([]);

    // Fetch suggested users from Firestore
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const usersQuerySnapshot = await getDocs(query(collection(db, 'users')));
                const usersData = usersQuerySnapshot.docs.map(doc => doc.data());
                // Filter out the current user from suggested users
                const filteredUsers = usersData.filter(user => user.userId !== auth.currentUser.uid);
                // Set the suggested users state
                setSuggestedUsers(filteredUsers);
            } catch (error) {
                console.error('Error fetching suggested users:', error);
            }
        };
        fetchSuggestedUsers();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Suggested Users</Text>
            {suggestedUsers.map(user => (
                <TouchableOpacity key={user.userId} style={styles.userContainer}>
                    <Image source={{ uri: user.profileImageUrl }} style={styles.userImage} />
                    <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userName: {
        fontSize: 16,
    },
});

export default HomeScreen;
