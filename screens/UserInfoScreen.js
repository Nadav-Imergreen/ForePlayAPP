import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getUserData } from '../services/firebaseDatabase'; // Assuming this is the function to fetch user data
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const UserInfoScreen = () => {

    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);



    useFocusEffect(
        React.useCallback(() => {
          // Fetch user data here
          fetchUserData();
        }, [])
      );

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const user = await getUserData();
            if (user) {
                setUserData(user);
            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditProfile = () => {
        navigation.navigate("EditProfile", { userData: userData });
    };

    const calculateCompletionPercentage = () => {
        if (!userData) return 0;
        const totalFields = 7;
        let filledFields = 0;

        if (userData.firstName) filledFields++;
        if (userData.lastName) filledFields++;
        if (userData.age) filledFields++;
        if (userData.sex) filledFields++;
        if (userData.hometown) filledFields++;
        if (userData.occupation) filledFields++;
        if (userData.aboutMe) filledFields++;

        return ((filledFields / totalFields) * 100).toFixed(0);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {userData && (
                <>
                    <View style={styles.section}>
                        <View>
                            <View style={[styles.photoBorderContainer, { borderColor: userData.sex === 'Male' ? '#a4cdbd' : '#f06478' }]}>
                                <Image source={{ uri: userData.images && userData.images.length > 0 ? userData.images[0] : null }} style={styles.photo} />
                            </View>
                            <TouchableOpacity style={styles.editIconContainer} onPress={handleEditProfile}>
                                    <Image source={require('../assets/edit.png')} style={styles.editIcon} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.name}>{userData.firstName} {userData.lastName}</Text>
                            <Text style={styles.age}>{userData.age}</Text>
                        </View>
                        <View style={styles.progressContainer}>
                            <Text style={styles.progressLabel}>Profile Completion</Text>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: `${calculateCompletionPercentage()}%` }]} />
                            </View>
                            <Text style={styles.progressPercentage}>{calculateCompletionPercentage()}%</Text>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 30,
        margin: 5,
        borderRadius: 10,
    },
    photoBorderContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 3,
        overflow: 'hidden',
        position: 'relative', // Add position relative for absolute positioning of edit icon
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    editIconContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        shadowColor: '#000',
        elevation: 5,
        bottom: 1,
        right: 1,
    },
    editIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    userInfo: {
        alignItems: 'center',
        marginTop: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    age: {
        fontSize: 16,
        marginTop: 5,
    },
    progressContainer: {
        marginTop: 20,
        width: '80%',
    },
    progressLabel: {
        fontSize: 16,
        marginBottom: 5,
        textAlign: 'center',
    },
    progressBar: {
        height: 20,
        backgroundColor: '#ddd',
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: '#000',
        elevation: 5,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#007AFF',
    },
    progressPercentage: {
        marginTop: 5,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default UserInfoScreen;