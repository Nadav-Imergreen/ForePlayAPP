import React, { useEffect, useState } from "react";
import {View, Image, Text, StyleSheet, Alert, TextInput, Button, TouchableOpacity, ScrollView} from "react-native";
import { getCurrentUser, getUsersBy, saveExtraInfo} from "../services/Databases/users";
import { createConversation} from "../services/Databases/chat";
import { matchAI } from "../services/matchAI";

const HomeScreen = ({navigation}) => {
    const [suggestedUsers, setSuggestedUsers] = useState([]); // State for suggested users
    const [currentIndex, setCurrentIndex] = useState(0); // State to track current index
    const [additionalInfoFilled, setAdditionalInfoFilled] = useState(false); // State to track if additional info is filled
    const [noResults, setNoResults] = useState(false); // State to track if there are no results
    const [aboutMe, setAboutMe] = useState('');
    const [desireMatch, setDesireMatch] = useState('');
    const [expanded, setExpanded] = useState(false); // State for expanding view
    const [isButtonActive, setIsButtonActive] = useState(false);
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            const currentUser = await getCurrentUser();
            if (currentUser.aboutMe === '' || currentUser.desireMatch === '') {
                setAdditionalInfoFilled(false);
            } else {
                setAdditionalInfoFilled(true);
                const usersSnapshot = await getUsersBy(currentUser);
                const usersData = usersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log('number of profiles found: ', usersData.length);
                if (usersData.length > 0) {
                    const matchedUsers = await matchAI(usersData);
                    setSuggestedUsers(matchedUsers);
                } else {
                    setNoResults(true);
                }
            }
        };
        fetchData().catch(e => console.error("Failed to fetch suggested users:", e.message));

        const intervalId = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown <= 1) {
                    clearInterval(intervalId);
                    setIsButtonActive(true); // Re-enable the button after the countdown
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);

    }, []);

    const handleAddInfo = async () => {
        if (aboutMe.trim() === '' || desireMatch.trim() === '') {
            Alert.alert('Error', 'Please fill in both fields.');
            return;
        }
        try {
            await saveExtraInfo(aboutMe, desireMatch);
            Alert.alert('Success', 'Information added successfully.');
            setAboutMe('');
            setDesireMatch('');
            setAdditionalInfoFilled(true);
        } catch (error) {
            console.error('Error adding info to Firestore: ', error);
            Alert.alert('Error', 'Failed to add information. Please try again.');
        }
    };

    const handleOpenConversation = async () => {
        // Placeholder for opening a conversation
        const conversationID =  await createConversation(suggestedUsers[currentIndex].userId);
        console.log("conversationID: ", conversationID);
        navigation.navigate('Chat', { conversationID: conversationID })
        Alert.alert("Conversation", "This will open a conversation with the user.");
    };

    const handleFindNewMatch = () => {
        if (!isButtonActive) {
            return;
        }

        setIsButtonActive(false); // Disable the button

        // Set the countdown to 60 seconds
        setCountdown(10);

        // Start the countdown
        const intervalId = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown <= 1) {
                    clearInterval(intervalId);
                    setIsButtonActive(true); // Re-enable the button after the countdown
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);
        if(isButtonActive){
            // Increment the current index to show the next suggested user after the countdown
            setCurrentIndex(currentIndex + 1);
            setExpanded(false);
        }
    };

    return (
        <View style={styles.container}>
            {additionalInfoFilled ? (
                <>
                    {suggestedUsers.length === 0 && (
                        <View style={styles.noSuggestionsContainer}>
                            <Text style={styles.noSuggestionsText}>
                                {noResults ? "No people in your area" : "Looking for people..."}
                            </Text>
                        </View>
                    )}

                    {suggestedUsers.length > 0 && currentIndex < suggestedUsers.length && (
                        <>
                            <View style={styles.userContainer}>
                                <Image source={{ uri: suggestedUsers[currentIndex].images[0] }} style={styles.image} />
                                <Text style={styles.userName}>
                                    {suggestedUsers[currentIndex].firstName}, {suggestedUsers[currentIndex].age}
                                </Text>
                                <Text style={styles.matchRate}>Match Rate: {suggestedUsers[currentIndex].matchRate}%</Text>
                                <TouchableOpacity style={styles.button} onPress={() => setExpanded(!expanded)}>
                                    <Text style={styles.buttonText}>Open AI Message</Text>
                                </TouchableOpacity>
                                {expanded && (
                                    <View style={styles.expandedView}>
                                        <ScrollView>
                                            <Text style={styles.modalText}>
                                                {suggestedUsers[currentIndex].messageContent}
                                            </Text>
                                            <TouchableOpacity
                                                style={[styles.button, styles.buttonClose]}
                                                onPress={() => setExpanded(false)}
                                            >
                                                <Text style={styles.buttonText}>Close</Text>
                                            </TouchableOpacity>
                                        </ScrollView>
                                    </View>
                                )}
                                <TouchableOpacity style={[styles.button, styles.conversationButton]} onPress={handleOpenConversation}>
                                    <Text style={styles.buttonText}>Start Conversation</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.newMatchButton]} onPress={handleFindNewMatch}>
                                    <Text style={styles.buttonText}>
                                        {isButtonActive ? "Find New Match" : `Next Match in ${countdown} seconds`}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}

                    {currentIndex >= suggestedUsers.length && currentIndex !== 0 && (
                        <View style={styles.noSuggestionsContainer}>
                            <Text style={styles.noSuggestionsText}>No more suggestions</Text>
                        </View>
                    )}
                </>
            ) : (
                <View style={styles.formContainer}>
                    <Text style={styles.additionalInfoText}>
                        Please fill in additional information to activate AI matching.
                    </Text>
                    <View style={styles.card}>
                        <Text style={styles.title}>Add Information</Text>
                        <TextInput
                            placeholder="Enter information about yourself"
                            value={aboutMe}
                            onChangeText={setAboutMe}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Describe your desired match"
                            value={desireMatch}
                            onChangeText={setDesireMatch}
                            style={styles.input}
                        />
                        <Button title="Add Info" onPress={handleAddInfo} />
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 110,
    },
    userContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
        image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 20,
    },
    userName: {
        fontSize: 24,
        marginBottom: 10,
    },
    matchRate: {
        fontSize: 18,
        color: 'gray',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
    },
    expandedView: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    buttonClose: {
        backgroundColor: '#f194ff',
        marginTop: 10,
    },
    conversationButton: {
        backgroundColor: '#4CAF50', // Green
    },
    newMatchButton: {
        backgroundColor: '#FF5722', // Orange
    },
    noSuggestionsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noSuggestionsText: {
        fontSize: 20,
        textAlign: 'center',
    },
    formContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    additionalInfoText: {
        fontSize: 16,
        color: "green",
        marginTop: 20,
        textAlign: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        marginBottom: 16,
        borderRadius: 5,
    },
});

export default HomeScreen;
