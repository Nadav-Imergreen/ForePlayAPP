import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Image,
    Text,
    StyleSheet,
    Alert,
    Animated,
    PanResponder,
    TouchableWithoutFeedback,
    TextInput,
    Button
} from "react-native";
import {
    checkForMatch,
    getCurrentUser,
    getUsersBy,
    saveExtraInfo,
    saveLike,
    saveLikeMe,
    saveSeen
} from "../services/firebaseDatabase";
import { matchAI } from "../services/matchAI";
import LinearGradient from "react-native-linear-gradient";

const HomeScreen = () => {
    const [suggestedUsers, setSuggestedUsers] = useState([]); // State for suggested users
    const [currentIndex, setCurrentIndex] = useState(0); // State to track current index
    const [additionalInfoFilled, setAdditionalInfoFilled] = useState(false); // State to track if additional info is filled
    const [noResults, setNoResults] = useState(false); // State to track current index
    const [aboutMe, setAboutMe] = useState('');
    const [desireMatch, setDesireMatch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            // get current user info
            const currentUser = await getCurrentUser();
            // Check if additional info is filled
            if (currentUser.aboutMe === '' || currentUser.desireMatch === '') {
                setAdditionalInfoFilled(false);
            } else {
                setAdditionalInfoFilled(true);
                // Filter suggested users by age and distance here
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

    // Function to handle navigation to the next profile.
    const nextProfile = () => {
        setCurrentIndex(currentIndex + 1);
    };

    // Function to handle navigation to the next profile.
    const handleLike = () => {
        const likedUser = suggestedUsers[currentIndex].userId;
        saveSeen(likedUser)
            .then(() => saveLike(likedUser)
                .then(() => saveLikeMe(likedUser)
                    .then(() => {
                        checkForMatch(likedUser);
                        nextProfile();
                    })))
    };

    // Function to handle navigation to the next profile.
    const handleDislike = () => {
        saveSeen(suggestedUsers[currentIndex].userId).then(() => nextProfile())
    };

    const pan = useRef(new Animated.ValueXY()).current;
    const [likePressed, setLikePressed] = useState(false);
    const [dislikePressed, setDislikePressed] = useState(false);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (e, gesture) => {
                if (gesture.dx > 120) { // Swipe right
                    setLikePressed(true);
                } else if (gesture.dx < -120) { // Swipe left
                    setDislikePressed(true);
                } else { // Reset button states if swipe is not significant
                    setLikePressed(false);
                    setDislikePressed(false);
                }
                Animated.event(
                    [
                        null,
                        { dx: pan.x, dy: pan.y }
                    ],
                    { useNativeDriver: false }
                )(e, gesture);
            },
            onPanResponderRelease: (e, gesture) => {
                setLikePressed(false);
                setDislikePressed(false);
                if (gesture.dx > 120) { // Swipe right
                    Animated.timing(pan, {
                        toValue: { x: 500, y: 0 },
                        duration: 300,
                        useNativeDriver: false
                    }).start(() => {
                        setTimeout(() => {
                            nextProfile();
                            Animated.timing(pan, {
                                toValue: { x: 0, y: 0 },
                                duration: 0,
                                useNativeDriver: false
                            }).start();
                        }, 500);
                    });
                } else if (gesture.dx < -120) { // Swipe left
                    Animated.timing(pan, {
                        toValue: { x: -500, y: 0 },
                        duration: 300,
                        useNativeDriver: false
                    }).start(() => {
                        setTimeout(() => {
                            nextProfile();
                            Animated.timing(pan, {
                                toValue: { x: 0, y: 0 },
                                duration: 0,
                                useNativeDriver: false
                            }).start();
                        }, 500);
                    });
                } else { // Return card to center
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false
                    }).start();
                }
            }
        })
    ).current;

    const rotate = pan.x.interpolate({
        inputRange: [-500, 0, 500],
        outputRange: ['-30deg', '0deg', '30deg']
    });

    const panStyle = {
        transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate: rotate }]
    };

    return (
        <View style={styles.container}>
            {additionalInfoFilled ? (
                <>
                    {/* Display message when waiting for data */}
                    {suggestedUsers.length === 0 && (
                        <View style={styles.noSuggestionsContainer}>
                            <Text style={styles.noSuggestionsText}>
                                {noResults ? "No people in your area" : "Looking for people..."}
                            </Text>
                        </View>
                    )}

                    {/* Render suggested user */}
                    {suggestedUsers.length > 0 && currentIndex < suggestedUsers.length && (
                        <>
                            <Animated.View style={[styles.card, panStyle]} {...panResponder.panHandlers}>
                                {suggestedUsers[currentIndex].images[0] && (
                                    <View style={styles.imageContainer}>
                                        <Image style={styles.image} resizeMode='contain' source={{ uri: suggestedUsers[currentIndex].images[0] }} />
                                    </View>
                                )}
                                <View style={styles.overlayContainer}>
                                    <LinearGradient
                                        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)']} // Gradient colors from white to black
                                        style={styles.gradientOverlay}
                                    />
                                    <Text style={styles.userName}>{suggestedUsers[currentIndex].firstName}, {suggestedUsers[currentIndex].age}</Text>
                                </View>
                            </Animated.View>

                            <View style={styles.buttonContainer}>
                                <TouchableWithoutFeedback
                                    onPressIn={() => setDislikePressed(true)}
                                    onPressOut={() => setDislikePressed(false)}
                                    onPress={handleDislike}
                                >
                                    <Animated.View style={[styles.buttonBody, { backgroundColor: dislikePressed ? '#f06478' : '#ffffff', transform: [{ scale: dislikePressed ? 1.2 : 1 }] }]}>
                                        <Image
                                            source={dislikePressed ? require('../assets/dislike.png') : require('../assets/dislike_pressed.png')}
                                            style={styles.buttonImage}
                                        />
                                    </Animated.View>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback
                                    onPressIn={() => setLikePressed(true)}
                                    onPressOut={() => setLikePressed(false)}
                                    onPress={handleLike}
                                >
                                    <Animated.View style={[styles.buttonBody, { backgroundColor: likePressed ? '#a4cdbd' : '#ffffff', transform: [{ scale: likePressed ? 1.2 : 1 }] }]}>
                                        <Image
                                            source={likePressed ? require('../assets/like.png') : require('../assets/like_pressed.png')}
                                            style={styles.buttonImage}
                                        />
                                    </Animated.View>
                                </TouchableWithoutFeedback>
                            </View>
                        </>
                    )}

                    {/* Display message when end of suggestedUsers array is reached */}
                    {currentIndex >= suggestedUsers.length && currentIndex !== 0 && (
                        <View style={styles.noSuggestionsContainer}>
                            <Text style={styles.noSuggestionsText}>No more suggestions</Text>
                        </View>
                    )}
                </>
            ) : (
                <View style={styles.formContainer}>
                    <Text style={styles.additionalInfoText}>Please fill in additional information to activate AI matching.</Text>
                    <View style={styles.card}>
                        <Text style={styles.title}>Add Information</Text>
                        <TextInput
                            mode="outlined"
                            label="About Me"
                            placeholder="Enter information about yourself"
                            value={aboutMe}
                            onChangeText={setAboutMe}
                            style={styles.input}
                        />
                        <TextInput
                            mode="outlined"
                            label="Desired Match"
                            placeholder="Describe your desired match"
                            value={desireMatch}
                            onChangeText={setDesireMatch}
                            style={styles.input}
                        />
                        <Button title="Add Info" onPress={handleAddInfo} style={styles.button} />
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
        paddingBottom: 110
    },
    card: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
        marginTop: 20,
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: 10,
        paddingBottom: 60
    },
    image: {
        flex: 1,
        width: '100%',
        aspectRatio: 1,
    },
    overlayContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
        borderRadius: 10,
        justifyContent: 'flex-end',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 10,
    },
    userName: {
        position: 'absolute',
        bottom: 60,
        left: 20,
        color: 'white',
        fontSize: 24,
        fontStyle: 'italic'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 50,
        paddingBottom: 20,
        position: 'absolute',
        bottom: 40,
    },
    buttonImage: {
        width: 40,
        height: 40,
    },
    buttonBody: {
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 50,
        padding: 10,
        backgroundColor: '#a4cdbd'
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
        padding: 20
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
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    },
});

export default HomeScreen;
