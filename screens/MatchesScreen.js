import React, { useEffect, useState } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getAllUsers, getUserData } from "../services/firebaseDatabase";

const HomeScreen = () => {
    const [suggestedUsers, setSuggestedUsers] = useState([]); // State for suggested users
    const [currentIndex, setCurrentIndex] = useState(0); // State to track current index

    // Fetch user data and suggested users from Firestore
    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentUser = await getUserData();
                if (currentUser.sex) {
                    const usersSnapshot = await getAllUsers(currentUser.sex);
                    const usersData = usersSnapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id, // Add unique id for each user
                    }));
                    setSuggestedUsers(usersData);
                } else {
                    throw new Error("User preferences are not filled");
                }
            } catch (error) {
                console.error("Failed to fetch suggested users:", error);
            }
        };

        fetchData();
    }, []);

    // Function to handle navigation to the next user
    const nextUser = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1 < suggestedUsers.length ? prevIndex + 1 : 0));
    };

    // Function to handle navigation to the previous user
    const previousUser = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : suggestedUsers.length - 1));
    };

    return (
        <View style={styles.container}>
            {/* Render suggested user */}
            {suggestedUsers.length > 0 && (
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
});

export default HomeScreen;
