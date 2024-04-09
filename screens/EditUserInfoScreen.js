import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { saveUserInfo } from '../services/firebaseDatabase';
import Loader from '../services/loadingIndicator';
import UploadImage from '../components/UploadImage';
import { handleSignOut } from '../services/auth';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/config';
import { saveUrl, getUserData } from '../services/firebaseDatabase';
import { HeaderBackButton } from '@react-navigation/elements';
import SwitchSelector from "react-native-switch-selector";


const EditUserInfoScreen = ({ route }) => {

    const navigation = useNavigation(); // Get navigation object
    const { userData } = route.params;
    const [loading, setLoading] = useState(false);
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
        setImageUrlsChanged(true);
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


    const fetchUserData = () => {
        setLoading(true);
        if (userData) {
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
        setLoading(false);
        setDataFetched(true);
    };

    const handleSaveUserInfo = async () => {
        setLoading(true);
        try {
            //await savePhoto();
            await saveUserInfo(firstName, lastName, age, sex, hometown, occupation, desireMatch, aboutMe);
            
        } catch (error) {
            console.error('Error saving user data:', error.message);
        } finally {
            setLoading(false);
            navigation.navigate('UserInfoScreen');
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

    const switchColor = sex === 'Male' ? '#a4cdbd' : '#f06478';

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.labels}>Media</Text>

                <View style={styles.section}>
                    <UploadImage setImageUrls={setImageUrls} imageUrls={imageUrls} />
                </View>
                
                <Text style={styles.labels}>Basic Information</Text>
                
                <View style={styles.section}>
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
                    <View style={styles.sexSelector}>
                        <View style={{ width: 200 }}>
                        {dataFetched && (<SwitchSelector
                                options = {[
                                    { label: 'Male', value: 0 },
                                    { label: 'Female', value: 1 },
                                  ]}
                                initial={sex === 'Male' ? 0 : 1}
                                onPress={(value) => setSex(value === 0 ? 'Male' : 'Female')}
                                textColor={'white'}
                                selectedColor={'white'}
                                buttonColor={switchColor}
                                borderColor={'darkgrey'}
                                backgroundColor={'darkgrey'}
                                valuePadding={0}
                                hasPadding
                                style={{ marginVertical: 10 }}
                            />)}
                        </View>
                        <Text>Sex</Text>
                    </View>
                </View>

                <Text style={styles.labels}>More Information</Text>

                <View style={styles.section}>
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
                </View>
                
              
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
        flex: 1
    },
    input: {
        marginBottom: 10,
        marginHorizontal: 5,
        color: 'black',
        borderBottomWidth: 1,
        height: 40,
        textAlign: "left"
    },
    labels: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginHorizontal: 10,
        marginVertical: 10
    },
    sexSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10
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
    section: {
        backgroundColor: 'white',
        paddingVertical: 10,
        margin: 5,
        borderRadius: 10,
    }
});

export default EditUserInfoScreen;