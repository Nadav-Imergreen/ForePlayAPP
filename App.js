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

export default function App() {
    const Stack = createNativeStackNavigator();

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);

    const onAuthStateChangedHandler = async (user) => {
        user ? console.log('INFO: auth state changed:', user.uid)
            : console.log('INFO: auth undefined - no user logged in');
        setUser(user);
        if (initializing) setInitializing(false);
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
                    <>
                        <Stack.Screen name="Home" component={HomeScreen}/>
                        <Stack.Screen name="UserInfo" component={UserInfoScreen}/>
                    </>
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
