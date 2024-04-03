import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { saveUserInfo } from '../services/firebaseDatabase';
import Loader from '../services/loadingIndicator';
import UploadImage from '../components/UploadImage';
import { handleSignOut } from '../services/auth';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/config';
import { saveUrl, getUserData } from '../services/firebaseDatabase';
import { HeaderBackButton } from '@react-navigation/elements';



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
    const [imageUrlsChanged, setImageUrlsChanged] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (dataFetched){
            setImageUrlsChanged(true);
        }
    }, [imageUrls]);

    useEffect( () => {
        navigation.setOptions({ headerShown: true,
                                headerLeft: (props) => (
                                    <HeaderBackButton
                                        {...props}
                                        onPress={() => {
                                            handleSaveUserInfo();
                                        }}
                                    />
                                )
                              });
    } );

    const fetchUserData = async () => {
        setLoading(true);
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
        } finally {
            setDataFetched(true);
            setLoading(false);
        }
    };

    const handleSaveUserInfo = async () => {
        setLoading(true);
        try {
            await savePhoto();
            await saveUserInfo(firstName, lastName, age, sex, hometown);
            
        } catch (error) {
            console.error('Error saving user data:', error.message);
        } finally {
            setLoading(false);
            navigation.navigate('Home');
        }
    };
    
   const savePhoto = async () => {
        if (!imageUrlsChanged) {
            console.log('INFO: No changes in image URLs');
            return;
        }

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
            
            // Collect the download URLs in an array
            const downloadURLs = [];

            // Loop through each new image URL and upload it to storage
            for (const imageUrl of imageUrls) {
                console.log(imageUrl);
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

            setImageUrlsChanged(false); // Reset imageUrlsChanged after uploading
        
        } catch (error) {
            console.error('ERROR: Failed to fetch image or upload:', error.message);
        }
    };

    const homeScreenNavigation = () => navigation.navigate('Home');

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.media}>Media</Text>
                <UploadImage setImageUrls={setImageUrls} imageUrls={imageUrls} />

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
                    <TouchableOpacity
                        style={[styles.sexButton, sex === 'Male' && styles.activeSexButton]}
                        onPress={() => setSex('Male')}>
                        <Text style={styles.sexButtonText}>Male</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sexButton, sex === 'Female' && styles.activeSexButton]}
                        onPress={() => setSex('Female')}>
                        <Text style={styles.sexButtonText}>Female</Text>
                    </TouchableOpacity>
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
                
              
                {loading && (
                <View style={styles.loaderContainer}>
                    <View style={styles.loaderBackground}>
                        <ActivityIndicator size={50} color="#0000ff" />
                    </View>
                </View>
                )}

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 12,
        paddingHorizontal: 10,
        margin: 5,
        color: 'black',
        backgroundColor: 'white',
    },
    media: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black'
    },
    radioGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    sexButton: {
        backgroundColor: '#ddd',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginRight: 10,
    },
    activeSexButton: {
        backgroundColor: '#f06478',
    },
    sexButtonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderBackground: {
        ...StyleSheet.absoluteFillObject, // Cover the entire screen
        backgroundColor: 'rgba(215, 215, 215, 0.5)',
        justifyContent: 'center', // Center the content vertically
        alignItems: 'center', // Center the content horizontally
        borderRadius: 10,
    },
});

export default UserInfoScreen;