import React, { useEffect, useState, useRef } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet, PanResponder, Animated } from "react-native";
import { getAllUsers, getUserData, saveUserLocation, getUsersBy } from "../services/firebaseDatabase";
import getLocation from '../services/getLocation';

const MatchesScreen = () => {

    const [suggestedUsers, setSuggestedUsers] = useState([]); // State for suggested users
    const [currentIndex, setCurrentIndex] = useState(0); // State to track current index 
    const [preferredSex, setPreferredSex] = useState();
    const [preferredAge, setPreferredAge] = useState([]);    
    const [preferedSexDefault, setPreferedSexDefault] = useState('Both');
    const [preferedAgeDefault, setPreferedAgeDefault] = useState([18, 60]);

    const { currentLocation } = getLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // get current user info
                const currentUser = await getUserData();
                if (!currentUser) {
                    // If user data couldn't be retrieved, show alert and provide retry option
                    Alert.alert(
                        "Error",
                        "Failed to fetch user data. Please try again.",
                        [{ text: "Retry", onPress: fetchData }],
                        { cancelable: false }
                    );
                    return;
                }
                //setUserPreferences(currentUser);

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
                    const userData = {
                        id: doc.id,
                        ...doc.data()
                    };
                    return userData;
                });

                // Filter suggested users by age and distance here
                const filteredUsers = usersData.filter(user => user.age >= currentUser.partner_age_bottom_limit && user.age <= currentUser.partner_age_upper_limit);

                setSuggestedUsers(filteredUsers);
    
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

    const setUserPreferences = (userData) => {
        if (!userData) { // If no user data is available, set full default preferences
            setPreferredSex(preferedSexDefault);
            setPreferredAge(preferedAgeDefault);
            return;
        }
    
        const { partner_gender, partner_age_bottom_limit, partner_age_upper_limit, sex, age } = userData;
    
        if (!partner_gender) {
            // Set partner gender preference based on user's gender or default to 'Both'
            setPreferredSex(sex ? (sex === 'male' ? 'female' : 'male') : preferedSexDefault);
        } else {
            // Set partner gender preference if available
            setPreferredSex(partner_gender);
        }
    
        if (!partner_age_bottom_limit && !partner_age_upper_limit) {
            // Set partner age preference based on user's age or default to [18, 60]
            setPreferredAge(age ? [Math.max(18, age - 2), Math.min(60, age + 2)] : preferedAgeDefault);
        } else {
            // Set partner age preference if available
            setPreferredAge([partner_age_bottom_limit, partner_age_upper_limit]);
        }
    };

    // Function to handle navigation to the next profile
    const nextProfile = () => {
        setCurrentIndex(currentIndex + 1);
    };

    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onPanResponderMove: Animated.event(
            [
              null,
              { dx: pan.x, dy: pan.y }
            ],
            { useNativeDriver: false }
          ),
          onPanResponderRelease: (e, gesture) => {
            if (gesture.dx > 120) { // Swipe right
              Animated.timing(pan, {
                toValue: { x: 500, y: 0 },
                duration: 300, // Adjust the duration as needed
                useNativeDriver: false
              }).start(() => {
                // After swiping out, delay and then show the new card
                setTimeout(() => {
                  nextProfile();
                  Animated.timing(pan, {
                    toValue: { x: 0, y: 0 },
                    duration: 0, // Instantly move back to center
                    useNativeDriver: false
                  }).start();
                }, 500); // Adjust the delay time as needed
              });
            } else if (gesture.dx < -120) { // Swipe left
              Animated.timing(pan, {
                toValue: { x: -500, y: 0 },
                duration: 300, // Adjust the duration as needed
                useNativeDriver: false
              }).start(() => {
                // After swiping out, delay and then show the new card
                setTimeout(() => {
                  nextProfile();
                  Animated.timing(pan, {
                    toValue: { x: 0, y: 0 },
                    duration: 0, // Instantly move back to center
                    useNativeDriver: false
                  }).start();
                }, 500); // Adjust the delay time as needed
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
  

  const panStyle = {
    transform: pan.getTranslateTransform()
  };

  return (
    <View style={styles.container}>
      {/* Render suggested user */}
      { suggestedUsers.length > 0 && currentIndex < suggestedUsers.length && (
        <Animated.View style={[styles.card, panStyle]} {...panResponder.panHandlers}>
          {suggestedUsers[currentIndex].images[0] && (
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: suggestedUsers[currentIndex].images[0] }} />
            </View>
          )}
          <View>
            <Text style={styles.userName}>{suggestedUsers[currentIndex].firstName} , {suggestedUsers[currentIndex].age}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={nextProfile}>
              <Image source={require('../assets/like.png')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity onPress={nextProfile}>
              <Image source={require('../assets/dislike.png')} style={styles.buttonImage} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Display message when end of suggestedUsers array is reached */}
      {currentIndex >= suggestedUsers.length && (
        <View style={[styles.card, styles.noSuggestionsContainer]}>
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
    paddingHorizontal: 20,
    paddingBottom: 120
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    marginTop: 40
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonImage: {
    width: 50,
    height: 50,
  },
  noSuggestionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSuggestionsText: {
    fontSize: 20, // Adjust the font size as needed
    textAlign: 'center',
  },
});


export default MatchesScreen;
