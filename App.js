import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './screens/loginScreen';
import RegisterScreen from './screens/RegisterScreen';
import UserInfoScreen from './screens/UserInfoScreen';
import HomeScreen from './screens/HomeScreen';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './services/config';
import {getUserData} from './services/firebaseDatabase'; // Import the function to retrieve user data

export default function App() {
    const Stack = createNativeStackNavigator();
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);
    const [userInfoSetup, setUserInfoSetup] = useState(false);

    // Handle user state changes
    const onAuthStateChangedHandler = async (user) => {
        user ? console.log('INFO: Auth state changed:', user.uid) : console.log('INFO: Auth state "user" not define');
        setUser(user);
        if (initializing) {
            setInitializing(false);
        }

        // Check if user is logged in
        if (user) {
            await getUserData(user.uid).then((userData) => {
                // Update userInfoSetup state if setup is true in the database
                if (userData.data().userInfoSetup) setUserInfoSetup(true)
            }).catch((error) => {
                console.error('Error retrieving user data:', error)
            })
        }
    }

    useEffect(() => {
        return onAuthStateChanged(auth, onAuthStateChangedHandler);
    }, []);

    if (initializing) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    userInfoSetup ? (
                        <Stack.Screen name="Home" component={HomeScreen}/>
                    ) : (
                        <Stack.Screen name="UserInfo" component={UserInfoScreen}/>)
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen}/>
                        <Stack.Screen name="Register" component={RegisterScreen}/>
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
});