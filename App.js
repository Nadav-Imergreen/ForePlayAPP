import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './screens/loginScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import UserInfoScreen from './screens/UserInfoScreen';
import EditUserInfoScreen from './screens/EditUserInfoScreen';
import EditUserPreferenceScreen from './screens/EditUserPreferenceScreen';
import MatchesScreen from './screens/MatchesScreen';
import AiMatchesScreen from './screens/AiMatchesScreen';
import LocationPermissionScreen from './screens/LocationPermissionScreen ';
import BottomTabNav from './components/BottomTabNav';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './services/config';
import ChatScreen from './screens/ChatScreen';
import ExtraInfo from "./components/AiExtraInfo";
import ConversationsScreen from "./screens/conversationsScreen";


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
            <Stack.Navigator initialRouteName='Welcome'>
                {user ? (
                    <>
                        <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} options={{headerShown: false}}/>
                        <Stack.Screen name="TabNavigator" component={BottomTabNav} options={{headerShown: false}}/>
                        <Stack.Screen name="UserInfoScreen" component={UserInfoScreen}/>
                        <Stack.Screen name="My profile" component={EditUserInfoScreen}/>
                        <Stack.Screen name="My Preferences" component={EditUserPreferenceScreen}/>
                        <Stack.Screen name="Matches" component={MatchesScreen}/>
                        <Stack.Screen name="AiMatches" component={AiMatchesScreen}/>
                        <Stack.Screen name="AddInfo" component={ExtraInfo}/>
                        <Stack.Screen name='Chat' component={ChatScreen}/>
                        <Stack.Screen name='Conversations' component={ConversationsScreen}/>
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}}/>
                        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
                        <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}}/>
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
