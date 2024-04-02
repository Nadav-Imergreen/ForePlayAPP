import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { saveUserInfo } from '../services/firebaseDatabase';
import Loader from '../services/loadingIndicator';
import UploadImage from '../components/UploadImage';
import { handleSignOut } from '../services/auth';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/config';
import { saveUrl, getUserData } from '../services/firebaseDatabase';
import { HeaderBackButton } from 'react-navigation';



const UserInfoScreen = () => {
    const navigation = useNavigation(); // Get navigation object

    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('Male'); // Default to Male
    const [hometown, setHometown] = useState('');
    const [imageUrls, setImageUrls] = useState([]);
    const [occupation, setOccupation] = useState('');
    const [desireMatch, setDesireMatch] = useState('');
    const [aboutMe, setAboutMe] = useState('');

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            handleSaveUserInfo();
        });

        return unsubscribe;
    }, [navigation]);

    const fetchUserData = async () => {
        try {
            const userData = await getUserData();
            if (userData) {
                setUserData(userData);
                setFirstName(userData.firstName || '');
                setLastName(userData.lastName || '');
                setAge(userData.age || '');
                setSex(userData.sex || 'Male');
                setHometown(userData.hometown || '');
                setOccupation(userData.occupation || '');
                setDesireMatch(userData.desireMatch || '');
                setAboutMe(userData.aboutMe || '');
                setImageUrls(userData.images || []);

            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
    };

    const handleSaveUserInfo = async () => {
        setLoading(true);
        await saveUserInfo(firstName, lastName, age, sex, hometown)
            .then(() => {
                savePhoto(); // Move savePhoto() inside the then block to ensure it's executed after saving user info
            })
            .catch((error) => console.error('Error saving user data:', error.message))
            .finally(() => setLoading(false));
    };
    
   const savePhoto = async () => {
    if (!imageUrls || imageUrls.length === 0) {
        alert('WARNING: Please choose an image from the library');
        return;
    }

    try {
        // Get the previous imageUrls from userData or set it as an empty array
        const previousImageUrls = userData ? userData.images || [] : [];

        // Filter out the URLs that already exist in previousImageUrls
        const newImageUrls = imageUrls.filter(url => !previousImageUrls.includes(url));

        // Check if there are new image URLs to upload
        if (newImageUrls.length > 0) {
            // Collect the download URLs in an array
            const downloadURLs = [];

            // Loop through each new image URL and upload it to storage
            for (const imageUrl of newImageUrls) {
                const imageRef = storageRef(storage, `images/${imageUrl}`);
                const blob = await fetch(imageUrl).then((res) => {
                    if (!res.ok) {
                        throw new Error('Failed to fetch image');
                    }
                    return res.blob();
                });
                console.log('INFO: Successfully fetched photo using URL');

                const snapshot = await uploadBytes(imageRef, blob);
                console.log('INFO: Uploaded an image!', snapshot.metadata.name);

                const url = await getDownloadURL(snapshot.ref);
                downloadURLs.push(url); // Collect the download URL
            }

            // Call saveUrl with the array of download URLs
            await saveUrl(downloadURLs);

            setImageUrls([]); // Clear imageUrls after uploading
        } else {
            // If there are no new image URLs, no need to update the Firestore document
            console.log('INFO: No new image URLs to upload');
        }
    } catch (error) {
        console.error('ERROR: Failed to fetch image or upload:', error.message);
    }
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
                placeholder="Desire match"
                value={desireMatch}
                onChangeText={setDesireMatch}
            />
            <TextInput
                style={styles.input}
                placeholder="About me"
                value={aboutMe}
                onChangeText={setAboutMe}
            />
            <UploadImage setImageUrls={setImageUrls} imageUrls={imageUrls}
/>
            {loading ? (
                <Loader />
            ) : (
                <Button title="Save User Info" onPress={handleSaveUserInfo} />
            )}
            <Button title="Back" onPress={homeScreenNavigation} />
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