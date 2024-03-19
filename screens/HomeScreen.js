import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Button, TouchableOpacity, Image} from 'react-native';
import {handleSignOut} from '../services/auth'; // Import handleSignOut function
import {useNavigation} from '@react-navigation/native';
import {getAllUsers, getUserData} from "../services/firebaseDatabase";

const HomeScreen = () => {
    const navigation = useNavigation(); // Get navigation object

    const [suggestedUsers, setSuggestedUsers] = useState([]); // State for suggested users

// Fetch user data and suggested users from Firestore
    useEffect(() => {
        const fetchData = async () => {

                const currentUser = await getUserData();
                if (currentUser.sex){
                    const usersSnapshot = await getAllUsers(currentUser.sex);
                    const usersData = usersSnapshot.docs.map(doc => ({
                        ...doc.data()
                    }));
                    setSuggestedUsers(usersData);
                    usersData.map(user => (
                        console.log('CHECK: SuggestedUsers ', user)
                    ));
                }
                else throw Error('user preference are not filled');
        };

        fetchData().catch((e)=> console.error('WARNING: failed to fetch suggested users:', e));
    }, []);


    // Handle navigation to UserInfoScreen when "Fill Info" button is pressed
    const infoScreenNavigation = () => navigation.navigate('UserInfo');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Suggested Users</Text>
            <Button title="Fill Info" onPress={infoScreenNavigation}/>
            <Button title="Sign Out" onPress={handleSignOut}/>
            {/* Render suggested users */}
            {suggestedUsers.length > 0 && suggestedUsers.map((user) => (
                <TouchableOpacity key={user.userId} style={styles.userContainer}>
                    {user.url && <Image style={styles.logo} source={{uri: user.url,}}/>}
                    <Text style={styles.userName}>{user.firstName}</Text>
                </TouchableOpacity>
            ))}
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
    logo: {
        width: 96,
        height: 98,
    },
});

export default HomeScreen;
