import React, {useState} from 'react';
import {StyleSheet, Text, View, Button, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {saveUserInfo} from '../services/firebaseDatabase';
import Loader from '../services/loadingIndicator';
import UploadImage from "../components/UploadImage";
import {handleSignOut} from '../services/auth';

const UserInfoScreen = () => {

    const navigation = useNavigation(); // Get navigation object

    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('Male'); // Default to Male
    const [hometown, setHometown] = useState('');
    const [occupation, setOccupation] = useState('');
    const [desireMatch, setDesireMatch] = useState('');


    const handleSaveUserInfo = async () => {
        setLoading(true);
        await saveUserInfo(firstName, lastName, age, sex, hometown, occupation, desireMatch)
            .then(() =>{})
            .catch((error) => console.error('Error saving user data:', error.message))
            .finally(() => setLoading(false))
    };

    const homeScreenNavigation = () => navigation.navigate('Home');


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Home Screen</Text>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                style={styles.input}
                placeholder="Age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
            />
            <View style={styles.radioGroup}>
                <Text>Sex:</Text>
                <View style={styles.radioOption}>
                    <Button
                        title="Male"
                        onPress={() => setSex('Male')}
                        color={sex === 'Male' ? 'blue' : 'gray'}
                    />
                </View>
                <View style={styles.radioOption}>
                    <Button
                        title="Female"
                        onPress={() => setSex('Female')}
                        color={sex === 'Female' ? 'blue' : 'gray'}
                    />
                </View>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Hometown"
                value={hometown}
                onChangeText={setHometown}
            />
            <TextInput
                style={styles.input}
                placeholder="Occupation"
                value={occupation}
                onChangeText={setOccupation}
            />
            <TextInput
                style={styles.input}
                placeholder="DesireMatch"
                value={desireMatch}
                onChangeText={setDesireMatch}
            />
            <UploadImage/>
            {loading ? (
                <Loader/>
            ) : (
                <Button title="Save User Info" onPress={handleSaveUserInfo}/>
            )}
            <Button title="Back" onPress={homeScreenNavigation}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    radioGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    radioOption: {
        marginLeft: 10,
    },
});

export default UserInfoScreen;
