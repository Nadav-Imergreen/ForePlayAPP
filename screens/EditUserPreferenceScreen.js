import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import {Slider} from '@miblanchard/react-native-slider';
import { saveUserPreferences } from '../services/firebaseDatabase';
import { HeaderBackButton } from '@react-navigation/elements';

const EditUserPreferenceScreen = ({ route }) => {
    const navigation = useNavigation();

    const [gender, setGender] = useState('Female'); // Default gender
    const [ageRange, setAgeRange] = useState([18, 25]); // Default age range
    const [radius, setRadius] = useState(10); // Default radius
    const [loading, setLoading] = useState(false);
    const { userData } = route.params;

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = () => {
        setLoading(true);
        if (userData) {
            setGender(userData.partner_gender || '');
            setAgeRange([userData.partner_age_bottom_limit, userData.partner_age_upper_limit] || []);
            setRadius(userData.radius || '');
        }
        setLoading(false);
    };

    useEffect( () => {
        navigation.setOptions({ headerShown: true,
                                headerLeft: (props) => (
                                    <HeaderBackButton
                                        {...props}
                                        onPress={() => {
                                            handleSave();
                                        }}
                                    />
                                )
                              });
    } );

    const handleSave = async () => {
        setLoading(true);
        try {
            
            await saveUserPreferences(gender, ageRange[0], ageRange[1], radius[0]);
            
        } catch (error) {
            console.error('Error saving user data:', error.message);
        } finally {
            setLoading(false);
            navigation.goBack();
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.label}>Show me:</Text>
                <Picker
                    selectedValue={gender}
                    onValueChange={(itemValue) => setGender(itemValue)}
                    >
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Both" value="Both" />
                </Picker>
            </View>

            <View style={styles.section}>
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>Age Range:</Text>
                    <Text style={styles.rangeText}>{`${ageRange[0]} - ${ageRange[1]}`}</Text>
                </View>
                <Slider
                    minimumValue={18}
                    maximumValue={60}
                    step={1}
                    value={ageRange}
                    rangeEnabled
                    minimumTrackTintColor="#007AFF"
                    thumbTintColor="#007AFF"
                    onValueChange={(value) => setAgeRange(value)}
                />
            </View>
            
            <View style={styles.section}>
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>Preferred Radius:</Text>
                    <Text style={styles.rangeText}>{`${radius} km`}</Text>
                </View>
                <Slider
                    minimumValue={1}
                    maximumValue={100}
                    step={1}
                    value={radius}
                    minimumTrackTintColor="#007AFF"
                    thumbTintColor="#007AFF"
                    onValueChange={(value) => setRadius(value)}
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        margin: 10
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 5
    },
    rangeText: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 5
    },
    ageRangeText: {
        textAlign: 'center',
        marginBottom: 15,
    },
    radiusText: {
        textAlign: 'center',
        marginBottom: 15,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
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

export default EditUserPreferenceScreen;