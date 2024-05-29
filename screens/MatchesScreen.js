import React, { useEffect, useState, useRef } from "react";
import { View, Image, Text, TouchableWithoutFeedback, StyleSheet, PanResponder, Animated, Alert } from "react-native";
import { getCurrentUser, getUsersBy, saveSeen, saveLike, saveLikeMe, checkForMatch, createConversation } from "../services/firebaseDatabase";
import ItsMatchModal from "../components/ItsMatchModal"
import LinearGradient from 'react-native-linear-gradient';

const MatchesScreen = () => {

    const [currentUser, setCurrentUser] = useState();
    const [suggestedUsers, setSuggestedUsers] = useState([]); // State for suggested users
    const [currentIndex, setCurrentIndex] = useState(0); // State to track current index 
    const [noResults, setNoResults] = useState(false);
    const currentIndexRef = useRef(0); // Using a ref to keep track of the current index
    const nextIndexRef = useRef(1); 
    const [photoIndex, setPhotoIndex] = useState(0);
    const [showLike, setShowLike] = useState(false);
    const [showDislike, setShowDislike] = useState(false);
    const [matchVisible, setMatchVisible] = useState(false);
    const [matchedUser, setMatchedUser] = useState(null);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
 

    useEffect(() => {
      const fetchData = async () => {
          try {
              // Get current user info
              const currentUser = await getCurrentUser().catch((err) => console.log(err));
              setCurrentUser(currentUser);
  
              // Only proceed to fetch suggested users if preferences are available
              const usersSnapshot = await getUsersBy(currentUser);
  
              // Get IDs of users already seen by the current user
              const seenUserIds = currentUser.seenUsers ? currentUser.seenUsers.map(user => Object.values(user)[0]) : [];
              console.log('seenUserIds: ' + seenUserIds);
            
  
              // Combined operation to map documents, calculate distance, filter by radius preference, and filter out seen users
              const usersWithDistance = usersSnapshot.docs.map(doc => {
                  const user = {
                      id: doc.id,
                      ...doc.data()
                  };
  
                  // Calculate distance between current user and suggested user
                  const distance = Math.round(calculateDistance(currentUser.location.latitude, currentUser.location.longitude, user.location.latitude, user.location.longitude));
  
                  // Check if the user is within the radius preference and not already seen
                  if (distance <= currentUser.radius[0] && !seenUserIds.includes(user.userId)) {
                      // If within radius and not already seen, add distance to user object
                      user.distance = distance;
                      return user;
                  } else {
                      // If not within radius or already seen, return null
                      return null;
                  }
              }).filter(user => user !== null); // Remove null entries from the array
  
              if (usersWithDistance.length > 0) {
                  setSuggestedUsers(usersWithDistance);
              } else {
                  setNoResults(true);
              }
  
          } catch (error) {
              console.error("Failed to fetch suggested users:", error.message);
              Alert.alert(
                  "Oops",
                  "We couldn't find people in your area. Please give it another try.",
                  [{ text: "Lets try again", onPress: fetchData }],
                  { cancelable: true }
              );
          }
      };
  
      fetchData();
  }, []);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of the Earth in kilometers

      // Convert latitude and longitude differences to radians
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);

      // Convert latitudes to radians
      const lat1Rad = lat1 * (Math.PI / 180);
      const lat2Rad = lat2 * (Math.PI / 180);

      // Calculate distance using spherical law of cosines
      const distance = Math.acos(Math.sin(lat1Rad) * Math.sin(lat2Rad) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon)) * R;

      return distance;
    };

    useEffect(() => {
      handleLike();
  }, [likes]); 

    useEffect(() => {
      handleDislike();
    }, [dislikes]); 

    // Function to handle navigation to the next profile.
    const nextProfile = () => {
        setPhotoIndex(0);
        const newIndex = currentIndexRef.current + 1; // Get the next index
        const newNextIndex = currentIndexRef.current + 2;
        currentIndexRef.current = newIndex; // Update the current index using ref
        nextIndexRef.current = newNextIndex;
        setCurrentIndex(newIndex);
    };

    const handleLike = () => {
      if (suggestedUsers.length > 0){
        setShowLike(true);
        const likedUser = suggestedUsers[currentIndex];
        const likedUserId = likedUser.userId

        // First, check for a match
        checkForMatch(likedUserId)
          .then(isMatch => {
              if (isMatch) {
                  setMatchedUser(likedUser);
                  setMatchVisible(true);
                  createConversation(likedUserId);
              }
          })
          .then(() => saveSeen(likedUserId))
          .then(() => saveLike(likedUserId))
          .then(() => saveLikeMe(likedUserId))
          .catch(error => {
              console.error('Error handling like action:', error);
          });

        // Adding a timeout
        setTimeout(() => {
          // Animate card moving to the right
          Animated.timing(pan, {
            toValue: { x: 500, y: 0 },
            duration: 400,
            useNativeDriver: false,
          }).start(() => {
            nextProfile();
            pan.setValue({ x: 0, y: 0 });
            setShowLike(false);
          });
        }, 400); // Adjust the timeout duration as per your requirement
      }
    };

    const handleDislike = () => {
      if (suggestedUsers.length > 0){
        setShowDislike(true);
        saveSeen(suggestedUsers[currentIndex].userId);

        // Adding a timeout
        setTimeout(() => {
          // Animate card moving to the left
          Animated.timing(pan, {
            toValue: { x: -500, y: 0 },
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            nextProfile();
            pan.setValue({ x: 0, y: 0 });
            setShowDislike(false);
          });
        }, 300); // Adjust the timeout duration as per your requirement
      }
    };

    const pan = useRef(new Animated.ValueXY()).current;
    const [likePressed, setLikePressed] = useState(false);
    const [dislikePressed, setDislikePressed] = useState(false);

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (e, gesture) => {
          if (gesture.dx > 20) { // Swipe right
            setLikePressed(true);
            setShowLike(true);
          } else if (gesture.dx < -20) { // Swipe left
            setDislikePressed(true);
            setShowDislike(true);
          } else { // Reset button states if swipe is not significant
            setLikePressed(false);
            setDislikePressed(false);
            setShowDislike(false);
            setShowLike(false);
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
          setShowDislike(false);
          setShowLike(false);
          if (gesture.dx > 120) { // Swipe right
            Animated.timing(pan, {
              toValue: { x: 500, y: 0 },
              duration: 300,
              useNativeDriver: false
            }).start(() => {
              setLikes(prevCounter => prevCounter + 1);
              setTimeout(() => {
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
              setDislikes(prevCounter => prevCounter + 1);
              setTimeout(() => {
                handleDislike();
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

    const handlePhotoChange = (direction) => {
      const userPhotos = suggestedUsers[currentIndex].images.length;
      if (direction === 'next') {
        setPhotoIndex((prevIndex) => (prevIndex + 1) % userPhotos);
      } else {
        setPhotoIndex((prevIndex) => (prevIndex - 1 + userPhotos) % userPhotos);
      }
    };

    const handleModalClose = () => {
      setMatchVisible(false);
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
            {/* Next profile card */}
            {suggestedUsers[nextIndexRef.current] && (
              <View style={styles.card}>
                <View style={styles.imageContainer}>
                  <Image style={styles.image} resizeMode='contain' source={{ uri: suggestedUsers[nextIndexRef.current].images[0] }} />
                  <View style={styles.photosIndicator}>
                    {suggestedUsers[nextIndexRef.current].images.map((_, index) => (
                      <View key={index} style={[styles.indicator, index === photoIndex ? styles.filledIndicator : styles.unfilledIndicator]} />
                    ))}
                  </View>
                </View>
                  <View style={styles.overlayContainer}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)']} // Gradient colors from white to black
                    style={styles.gradientOverlay}
                  />
                  <Text style={styles.userName}>{suggestedUsers[nextIndexRef.current].firstName}, {suggestedUsers[nextIndexRef.current].age}</Text>
                  <Text style={styles.distance}>{suggestedUsers[nextIndexRef.current].distance} kilometers from you</Text>
                </View>
              </View>
            )}

            {/* Current profile card */}
            {suggestedUsers[currentIndex].images[0] && (
              <Animated.View style={[styles.card, panStyle]} {...panResponder.panHandlers}>
                <View style={styles.imageContainer}>
                  <Image style={styles.image} resizeMode='contain' source={{ uri: suggestedUsers[currentIndex].images[photoIndex] }} />
                  <View style={styles.photosIndicator}>
                    {suggestedUsers[currentIndex].images.map((_, index) => (
                      <View key={index} style={[styles.indicator, index === photoIndex ? styles.filledIndicator : styles.unfilledIndicator]} />
                    ))}
                  </View>
                  {showLike && (<View style={styles.likeContainer}>
                    <Image source={require('../assets/like_logo.png')} style={styles.likeLogo} />
                  </View>)}
                  {showDislike && (<View style={styles.dislikeContainer}>
                    <Image source={require('../assets/dislike_logo.png')} style={styles.dislikeLogo} />
                  </View>)}
                  <TouchableWithoutFeedback onPress={() => handlePhotoChange('prev')}>
                    <View style={styles.prevOverlay} />
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={() => handlePhotoChange('next')}>
                    <View style={styles.nextOverlay} />
                  </TouchableWithoutFeedback>
                </View>
              
                <View style={styles.overlayContainer}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)']} // Gradient colors from white to black
                    style={styles.gradientOverlay}
                  />
                  <Text style={styles.userName}>{suggestedUsers[currentIndex].firstName}, {suggestedUsers[currentIndex].age}</Text>
                  <Text style={styles.distance}>{suggestedUsers[currentIndex].distance} kilometers from you</Text>
                </View>
              </Animated.View>
            )}

            {/* Its a Match modal */}
            {matchedUser && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ItsMatchModal
                    visible={matchVisible}
                    user1={currentUser}
                    user2={matchedUser}
                    onClose={handleModalClose}
                />
            </View>}

  
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
        paddingBottom: 60,
      },
      photosIndicator: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '10%',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      indicator: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        marginTop: 5,
        marginHorizontal: 5
      },
      filledIndicator: {
        backgroundColor: 'white',
        width: 20,
      },
      unfilledIndicator: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 20,
    },
    prevOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: '50%', // Adjusted width to 50% of the screen width
    },
    nextOverlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: '50%', // Adjusted width to 50% of the screen width
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
    distance: {
      position: 'absolute',
      bottom: 40, // Adjust the positioning as needed
      left: 20, // Adjust the positioning as needed
      color: 'white',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 70,
      paddingBottom: 20,
      position: 'absolute',
      bottom: 40,
    },
    buttonImage: {
      width: 30,
      height: 30,
    },
    buttonBody: {
      borderRadius: 50,
      padding: 16,
      elevation: 5
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
    likeContainer: {
      position: 'absolute',
      top: 10,
      left: 10,
    },
    likeLogo: {
      width: 180, // Adjust the size as needed
      height: 180, // Adjust the size as needed
      resizeMode: 'contain',
      transform: [{ rotate: '-20deg' }]
    },
    dislikeContainer: {
      position: 'absolute',
      top: 10,
      right: 10,
    },
    dislikeLogo: {
      width: 180, // Adjust the size as needed
      height: 180, // Adjust the size as needed
      resizeMode: 'contain',
      transform: [{ rotate: '20deg' }]
    },
    alertTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'red', // Example color, adjust as needed
  },
  alertMessage: {
      fontSize: 16,
      color: 'black', // Example color, adjust as needed
  },
  alertButton: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'blue', // Example color, adjust as needed
  }
  });

export default MatchesScreen;
