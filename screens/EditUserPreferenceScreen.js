import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Slider } from '@miblanchard/react-native-slider';
import Geolocation from '@react-native-community/geolocation';
import { saveUserPreferences } from '../services/Databases/users';
import { HeaderBackButton } from '@react-navigation/elements';
import LocationPicker from '../components/LocationPicker'; // Make sure the path is correct
import axios from 'axios';

const EditUserPreferenceScreen = ({ route, navigation }) => {

    const [gender, setGender] = useState('Female'); // Default gender
    const [ageRange, setAgeRange] = useState([18, 25]); // Default age range
    const [radius, setRadius] = useState(10); // Default radius
    const [loading, setLoading] = useState(false);
    const { userData } = [route.params];

    const [useCurrentLocation, setUseCurrentLocation] = useState(true);
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState(null);
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = () => {
        setLoading(true);
        if (userData) {
            setGender(userData.partner_gender || 'Female');
            const bottomLimit = userData.preferredAgeRange?.[0] || 18;
            const upperLimit = userData.preferredAgeRange?.[1] || 25;
            setAgeRange([bottomLimit, upperLimit]);
            setRadius(userData.radius || 10);
            setLocation(userData.location || null);
        }
        setLoading(false);
    };

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerLeft: (props) => (
                <HeaderBackButton
                    {...props}
                    onPress={() => {
                        handleSave();
                    }}
                />
            )
        });
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            await saveUserPreferences(gender, ageRange, radius, location);
        } catch (error) {
            console.error('Error saving user data:', error.message);
        } finally {
            setLoading(false);
            navigation.goBack();
        }
    };

    const getCurrentLocation = () => {
        setLoading(true);
        Geolocation.getCurrentPosition(
            async position => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                setLoading(false);
                const address = await fetchAddress(latitude, longitude);
                setAddress(address);
            },
            error => {
                console.error(error);
                setLoading(false);
                let errorMessage = 'Failed to get current location. Please try again.';
                if (error.code === 1) {
                    errorMessage = 'Location permission denied. Please enable location services in settings.';
                } else if (error.code === 2) {
                    errorMessage = 'Location unavailable. Please ensure your device has a clear view of the sky.';
                } else if (error.code === 3) {
                    errorMessage = 'Location request timed out. Please try again.';
                }
                Alert.alert('Error', errorMessage);
            },
            { enableHighAccuracy: false, timeout: 3000, maximumAge: 100000 }
        );
    };

    const fetchAddress = async (latitude, longitude) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBtGxk9FGFoPI5WIgD5ruapcK0Mp6gZ9Nw`
            );
            if (response.data.results.length > 0) {
                const address = response.data.results[0].formatted_address;
                return address;
            } else {
                return 'Address not found';
            }
        } catch (error) {
            console.error('Error fetching address:', error);
            return 'Error fetching address';
        }
    };

    const handleLocationSelect = async (selectedLocation) => {
        setLocation(selectedLocation);
        setShowMap(false);
        const address = await fetchAddress(selectedLocation.latitude, selectedLocation.longitude);
        setAddress(address);
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
                    <Text style={styles.label}>Age range:</Text>
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
                    <Text style={styles.label}>Preferred radius:</Text>
                    <Text style={styles.rangeText}>{`${radius} km`}</Text>
                </View>
                <Slider
                    minimumValue={1}
                    maximumValue={1000}
                    step={1}
                    value={radius}
                    minimumTrackTintColor="#007AFF"
                    thumbTintColor="#007AFF"
                    onValueChange={(value) => setRadius(value)}
                />
            </View>

            <View style={styles.section}>
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>Location:</Text>
                    {location && (
                        <Text style={styles.addressText}>{address}</Text>
                    )}
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={getCurrentLocation}
                    >
                        <Text style={styles.buttonText}>Use Current Location</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>or</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setShowMap(true)}
                    >
                        <Text style={styles.buttonText}>Pick Location from Map</Text>
                    </TouchableOpacity>
                </View>

            </View>

            {showMap && (
                <LocationPicker onLocationSelect={handleLocationSelect} />
            )}

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
        paddingTop: 10
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 5,
        margin: 5,
        marginHorizontal: 10
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 5,
        color: 'black'
    },
    buttonContainer: {
        padding: 5,
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', // Align buttons and text vertically
    },
    button: {

        borderRadius: 10,
        padding: 8,
        backgroundColor: '#ff5252',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    rangeText: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 5,
    },
    addressText: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 5,
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
    smallTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default EditUserPreferenceScreen;