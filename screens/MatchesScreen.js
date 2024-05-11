import React, { useEffect, useState, useRef } from "react";
import { View, Image, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, PanResponder, Animated, Alert } from "react-native";
import { getAllUsers, getCurrentUser, saveUserLocation, getUsersBy, saveSeen, saveLike, saveLikeMe, checkForMatch } from "../services/firebaseDatabase";
import getLocation from '../services/getLocation';
import LinearGradient from 'react-native-linear-gradient';

const MatchesScreen = () => {

    const [suggestedUsers, setSuggestedUsers] = useState([]); // State for suggested users
    const [currentIndex, setCurrentIndex] = useState(0); // State to track current index 
    const [noResults, setNoResults] = useState(false); // State to track current index 
    const currentIndexRef = useRef(0); // Using a ref to keep track of the current index

    const { currentLocation } = getLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // get current user info
                const currentUser = await getCurrentUser();
                if (!currentUser) {
                    // If user data couldn't be retrieved, show alert and provide retry option
                    Alert.alert(
                        "Error",
                        "Failed to fetch user data. Please try again.",
                        [{ text: "Retry", onPress: fetchData }],
                        { cancelable: true }
                    );
                    return;
                }

                if (!currentUser.partner_gender || !currentUser.partner_age_bottom_limit) {
                    // If user preferences are empty, show a message encouraging the user to fill them
                    Alert.alert(
                        "Notice",
                        "Please fill in your preferences to get better suggestions.",
                        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                        { cancelable: false }
                    );
                }
                // Only proceed to fetch suggested users if preferences are available
                const usersSnapshot = await getUsersBy(currentUser.partner_gender);
                const usersData = usersSnapshot.docs.map(doc => {
                    return {
                        id: doc.id,
                        ...doc.data()
                    };
                });
                // Filter suggested users by age and distance here
                const filteredUsers = usersData.filter(user => user.age >= currentUser.partner_age_bottom_limit && user.age <= currentUser.partner_age_upper_limit);
                if (filteredUsers && filteredUsers.length > 0){
                  setSuggestedUsers(usersData);
                }
                else{
                  setNoResults(true);
                }
    
            } catch (error) {
                console.error("Failed to fetch suggested users:", error.message);
                Alert.alert(
                    "Error",
                    "Failed to fetch suggested users. Please try again.",
                    [{ text: "Retry", onPress: fetchData }],
                    { cancelable: false }
                );
            }
        };

        fetchData();
    }, []);

    // Function to handle navigation to the next profile.
    const nextProfile = () => {
        const newIndex = currentIndexRef.current + 1; // Get the next index
        currentIndexRef.current = newIndex; // Update the current index using ref
        setCurrentIndex(newIndex);
    };

    // Function to handle navigation to the next profile.
    const handleLike = () => {
      nextProfile();
      const likedUser = suggestedUsers[currentIndex].userId;
      saveSeen(likedUser)
          .then(() => saveLike(likedUser)
              .then(() => saveLikeMe(likedUser)
                  .then(() => {
                      
                      checkForMatch(likedUser);
                  })))
  };

  // Function to handle navigation to the next profile.
  const handleDislike = () => {
      nextProfile();
      saveSeen(suggestedUsers[currentIndex].userId);
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
                
                Animated.timing(pan, {
                  toValue: { x: 0, y: 0 },
                  duration: 0,
                  useNativeDriver: false
                }).start();
                nextProfile();
              }, 500);
            });
          } else if (gesture.dx < -120) { // Swipe left
            Animated.timing(pan, {
              toValue: { x: -500, y: 0 },
              duration: 300,
              useNativeDriver: false
            }).start(() => {
              setTimeout(() => {
                
                Animated.timing(pan, {
                  toValue: { x: 0, y: 0 },
                  duration: 0,
                  useNativeDriver: false
                }).start();
                nextProfile();
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

export default MatchesScreen;
