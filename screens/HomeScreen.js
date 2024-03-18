import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import {getUserData} from '../services/firebaseDatabase'; // Import getUserData function
import {handleSignOut} from '../services/auth'; // Import handleSignOut function
import UserInfoScreen from './UserInfoScreen'; // Import UserInfoScreen
import {useNavigation} from '@react-navigation/native';
import {auth} from "../services/config";

const HomeScreen = () => {
    const navigation = useNavigation(); // Get navigation object

    const [suggestedUsers, setSuggestedUsers] = useState([]); // State for suggested users

    // Fetch user data and suggested users from Firestore
    useEffect(() => {
        const fetchData = async () => {
        };
        fetchData()
            .catch((error)=> console.error('WARNING: Error retrieving user data:', error))
    }, []);

    // Handle navigation to UserInfoScreen when "Fill Info" button is pressed
    const infoScreenNavigation = () => navigation.navigate('UserInfo');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Suggested Users</Text>
            <Button title="Fill Info" onPress={infoScreenNavigation}/>
            <Button title="Sign Out" onPress={handleSignOut}/>
            {/* Render suggested users */}
            {/* {suggestedUsers.map(user => (
        <TouchableOpacity key={user.userId} style={styles.userContainer}>
          <Image source={{ uri: user.profileImageUrl }} style={styles.userImage} />
          <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
        </TouchableOpacity>
      ))} */}
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
