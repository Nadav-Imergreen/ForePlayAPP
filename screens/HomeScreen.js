import React from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import {handleSignOut} from '../services/auth';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = () => {
    const navigation = useNavigation(); // Get navigation object

    // Handle navigation to various screens when buttons are pressed
    const infoScreenNavigation = () => navigation.navigate('Edit profile');
    const handleSeeMatches = () => navigation.navigate('Matches');
    const handleSeeAiMatches = () => navigation.navigate('AiMatches');

    return (
        <View style={styles.container}>
            <Button title="see Maches" onPress={handleSeeMatches}/>
            <Button title="see Ai Maches" onPress={handleSeeAiMatches}/>
            <Button title="Fill Info" onPress={infoScreenNavigation}/>
            <Button title="Sign Out " onPress={handleSignOut}/>
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
