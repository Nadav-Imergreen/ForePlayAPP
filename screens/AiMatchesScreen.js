import React, {useEffect, useRef, useState} from "react";
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Animated,
    PanResponder,
    TouchableWithoutFeedback
} from "react-native";
import {
    checkForMatch,
    getAllUsers,
    getCurrentUser,
    getUsersBy,
    saveExtraInfo,
    saveLike,
    saveLikeMe,
    saveSeen
} from "../services/firebaseDatabase";
import {matchAI} from "../services/matchAI";
import {Card, Provider as PaperProvider, TextInput, Title, Button} from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";

const HomeScreen = ({navigation}) => {
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
            // Filter suggested users by age and distance here
            const usersSnapshot = await getUsersBy(currentUser);

            const usersData = usersSnapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                };
            });

            console.log('usersData length: ', usersData.length);

            if (usersData.length > 0) return usersData;
            else setNoResults(true);

            // setAdditionalInfoFilled((currentUser.desireMatch && currentUser.occupation));
        }

        if (getCurrentUser().aboutMe === '' || getCurrentUser().desireMatch === '')
            setAdditionalInfoFilled(false);
        else {
            setAdditionalInfoFilled(true);
            fetchData()
                .then(async (usersData) => await matchAI(usersData)
                    .then((res) => setSuggestedUsers(res))
                    .catch((error) => console.error("WARNING: An error occurred while processing the matchAI request:", error)))
                .catch((e) => console.error("Failed to fetch suggested users:", e.message));
        }

    }, []);

    console.log('suggestedUsers:', suggestedUsers);

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
        flex: 1, // Allow the image container to expand to fill the available space
        alignItems: 'center', // Center the image horizontally
        overflow: 'hidden', // Clip the image if it exceeds the container's boundaries
        borderRadius: 10, // Apply border radius to match the card's border radius
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
        height: '60%', // Half the height of the card
        borderRadius: 10, // Apply border radius to match the card's border radius
        justifyContent: 'flex-end', // Align the overlay content at the bottom
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject, // Position the gradient overlay to cover the whole overlayContainer
        borderRadius: 10, // Apply border radius to match the card's border radius
    },
    userName: {
        position: 'absolute',
        bottom: 60, // Adjust the positioning as needed
        left: 20, // Adjust the positioning as needed
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
        fontSize: 20, // Adjust the font size as needed
        textAlign: 'center',
    },
});


//     // Function to handle navigation to the next user
//     const nextUser = () => {
//         setCurrentIndex((prevIndex) => (prevIndex + 1 < suggestedUsers.length ? prevIndex + 1 : 0));
//     };
//
//     // Function to handle navigation to the previous user
//     const previousUser = () => {
//         setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : suggestedUsers.length - 1));
//     };
//
//     return (
//         <PaperProvider>
//             <View style={styles.container}>
//                 {/* Render suggested user */}
//                 {additionalInfoFilled && suggestedUsers.length > 0 && (
//                     <View>
//                         <TouchableOpacity style={styles.userContainer}>
//                             {suggestedUsers[currentIndex].url && (
//                                 <Image style={styles.logo} source={{uri: suggestedUsers[currentIndex].url}}/>
//                             )}
//                             <Text style={styles.userName}>{suggestedUsers[currentIndex].firstName}</Text>
//                         </TouchableOpacity>
//                         <View style={styles.buttonContainer}>
//                             <TouchableOpacity onPress={previousUser}>
//                                 <Text style={styles.buttonText}>Previous</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity onPress={nextUser}>
//                                 <Text style={styles.buttonText}>Next</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 )}
//
//                 {/* Additional info form */}
//                 {!additionalInfoFilled && (
//                     <View style={styles.formContainer}>
//                         <Text style={styles.additionalInfoText}>Please fill in additional information in User Info to
//                             activate AI matching.</Text>
//                         <Card style={styles.card}>
//                             <Card.Content>
//                                 <Title style={styles.title}>Add Information</Title>
//                                 <TextInput
//                                     mode="outlined"
//                                     label="About Me"
//                                     placeholder="Enter information about yourself"
//                                     value={aboutMe}
//                                     onChangeText={setAboutMe}
//                                     style={styles.input}
//                                 />
//                                 <TextInput
//                                     mode="outlined"
//                                     label="Desired Match"
//                                     placeholder="Describe your desired match"
//                                     value={desireMatch}
//                                     onChangeText={setDesireMatch}
//                                     style={styles.input}
//                                 />
//                                 <Button mode="contained" onPress={handleAddInfo} style={styles.button}>
//                                     Add Info
//                                 </Button>
//                             </Card.Content>
//                         </Card>
//                     </View>
//                 )}
//
//                 {noResults && <Text>No users found based on your criteria.</Text>}
//             </View>
//         </PaperProvider>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "white",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     userContainer: {
//         alignItems: "center",
//         marginBottom: 10,
//     },
//     userName: {
//         fontSize: 16,
//     },
//     logo: {
//         width: 96,
//         height: 98,
//         borderRadius: 48,
//     },
//     buttonContainer: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginTop: 20,
//         width: "80%",
//     },
//     buttonText: {
//         fontSize: 16,
//         color: "blue",
//     },
//     additionalInfoText: {
//         fontSize: 16,
//         color: "green",
//         marginTop: 20,
//         textAlign: "center",
//         paddingHorizontal: 20,
//     },
//     formContainer: {
//         width: "100%",
//         alignItems: "center",
//     },
//     card: {
//         width: '100%',
//         maxWidth: 400,
//         padding: 16,
//     },
//     title: {
//         fontSize: 24,
//         marginBottom: 16,
//         textAlign: 'center',
//     },
//     input: {
//         marginBottom: 16,
//     },
//     button: {
//         marginTop: 16,
//     },
// });
//



export default HomeScreen;
