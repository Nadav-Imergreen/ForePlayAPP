import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { saveUserInfo } from '../services/Databases /users';
import UploadImage from '../components/UploadImage';
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
            const data = {
                firstName: firstName,
                lastName: lastName,
                age: age,
                sex: sex,
                hometown: hometown,
                occupation: occupation,
                desireMatch: desireMatch,
                aboutMe: aboutMe
            };
            //await savePhoto();
            await saveUserInfo(data);
            
        } catch (error) {
            console.error('Error saving user data:', error.message);
        } finally {
            setLoading(false);
            navigation.goBack();
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
                        <Text style={{fontSize: 16, color: 'black'}}>Sex</Text>
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
        paddingHorizontal: 20
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