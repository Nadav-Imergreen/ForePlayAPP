import React, { useEffect, useState } from "react";
import {View, Image, Text, TouchableOpacity, StyleSheet, Button} from "react-native";
import { getAllUsers, getUserData } from "../services/firebaseDatabase";
import { matchAI } from "../services/matchAI";

const HomeScreen = ({ navigation }) => {
    const [suggestedUsers, setSuggestedUsers] = useState([]); // State for suggested users
    const [currentIndex, setCurrentIndex] = useState(0); // State to track current index
    const [additionalInfoFilled, setAdditionalInfoFilled] = useState(false); // State to track if additional info is filled

    // Fetch user data and suggested users from Firestore
    useEffect(() => {
        const fetchData = async () => {
            // Get current user info
            const currentUser = await getUserData().catch((e)=> console.error(e.message));
            if (!currentUser.sex)
                alert('WARNING: you need to fill your gender in order to match to other people');
            // If additional info is not filled, setAdditionalInfoFilled true
            setAdditionalInfoFilled((currentUser.desireMatch && currentUser.occupation));
            const gender2seek = currentUser.sex === 'Male'? 'Female' : 'Male';
            const usersSnapshot = await getAllUsers(gender2seek).catch((e)=> console.log(e.message));
            const usersData = usersSnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id, // Add unique id for each user
            }));
            setSuggestedUsers(usersData);

            await matchAI(currentUser, usersSnapshot)
                    .then((score)=> console.log('CHECK: AI message: ', score));
        }

        fetchData().catch((e)=> console.error("Failed to fetch suggested users:", e.message));
    }, []); // Include additionalInfoFilled in dependency array

    // Function to handle navigation to the next user
    const nextUser = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1 < suggestedUsers.length ? prevIndex + 1 : 0));
    };

    // Function to handle navigation to the previous user
    const previousUser = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : suggestedUsers.length - 1));
    };

    // Function to handle navigation to the Info screen
    const goToInfoScreen = () => {
        navigation.navigate('UserInfo'); // Navigate to the Info screen
    };

    return (
        <View style={styles.container}>
            {/* Render suggested user */}
            {additionalInfoFilled && suggestedUsers.length > 0 && (
                <View>
                    <TouchableOpacity style={styles.userContainer}>
                        {suggestedUsers[currentIndex].url && (
                            <Image style={styles.logo} source={{ uri: suggestedUsers[currentIndex].url }} />
                        )}
                        <Text style={styles.userName}>{suggestedUsers[currentIndex].firstName}</Text>
                    </TouchableOpacity>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={previousUser}>
                            <Text style={styles.buttonText}>Previous</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={nextUser}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Additional info button */}
            {!additionalInfoFilled && (
                <View>
                    <Text style={styles.additionalInfoButton}>Please fill in additional information in User Info to activate AI matching.</Text>
                    <Button title="additional information" onPress={goToInfoScreen}/>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },
    userContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    userName: {
        fontSize: 16,
    },
    logo: {
        width: 96,
        height: 98,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    buttonText: {
        fontSize: 16,
        color: "blue",
    },
    additionalInfoButton: {
        fontSize: 16,
        color: "green",
        marginTop: 20,
    },
});

export default HomeScreen;
