import { useState, useEffect } from 'react';
import { PermissionsAndroid, StyleSheet, View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { saveUserLocation } from "../services/Databases/users";
import { useNavigation, CommonActions } from '@react-navigation/native';
import Loader from '../services/loadingIndicator';

const LocationPermissionScreen = () => {
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    checkAndRequestLocationPermission();
  }, []); // Check and request permission only once when the component mounts

  const checkAndRequestLocationPermission = async () => {
    try {
      console.log("Checking location permission");
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      );
      if (granted) {
        console.log('Permission already granted');
        getCurrentLocation();
      } else {
        setLoading(false);
        console.log('Location permission not granted');
        // Show UI to prompt the user for permission
      }
    } catch (err) {
      console.warn(err);
      console.log('Error checking location permission');
    }
  };

  const requestLocationPermission = async () => {
    try {
      console.log("Requesting location permission");
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission granted');
        getCurrentLocation();
      } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
        console.log('Location permission denied');
        Alert.alert(
          "Permission Required",
          "This app needs access to your location to function properly.",
          [{ text: "OK" }]
        );
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log('Location permission denied permanently');
        Alert.alert(
          "Permission Required",
          "You have denied location permission permanently. Please go to settings and enable the location permission for this app.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "OK" }
          ]
        );
      }
    } catch (err) {
      console.warn(err);
      console.log('Error requesting location permission');
    }
  };

  const getCurrentLocation = () => {
    setLoading(true);
    setLocationError(null); // Clear any previous error message
    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        console.log('Latitude:', latitude, 'Longitude:', longitude);
        setCurrentLocation({ latitude, longitude });
        await saveUserLocation({ latitude, longitude });
        setLoading(false);

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'TabNavigator' }],
          })
        );
      },
      error => {
        setLoading(false);
        console.log(error.code, error.message);
        setLocationError('Failed to get your current location.\nPlease try again.');
      },
      { enableHighAccuracy: false, timeout: 3000, maximumAge: 1000000 }
    );
  };

  const handleContinue = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0, // Reset the navigation stack
        routes: [
          { name: 'TabNavigator', params: { screen: 'UserInfoScreen' } }
        ],
      })
    );
  };

  const handleAllow = () => {
    requestLocationPermission();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>So, are you from around here?</Text>
        <Text style={styles.message}>
          Set your location to see who’s in your neighborhood or beyond. You won’t be able to match with people otherwise.
        </Text>
      </View>
      <View style={styles.middleContainer}>
        <View style={styles.locationIcon}>
          <Image source={require('../assets/location.png')} style={styles.locationImage} />
        </View>
      </View>
      <View style={styles.middleContainer2}>
        {locationError && <Text style={styles.errorText}>{locationError}</Text>}
        {loading && <Text style={styles.loadingText}>Getting location...</Text>}
        {loading && <Loader />}
      </View>
      <View style={styles.bottomContainer}>
        {!loading && (
          <TouchableOpacity style={styles.allowButton} onPress={locationError ? getCurrentLocation : handleAllow}>
            <Text style={styles.allowButtonText}>{locationError ? 'Try again' : 'Allow'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  topContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 40,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  middleContainer: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: 'black',
  },
  locationIcon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#c7d7e2",
    elevation: 5
  },
  locationImage: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain'
  },
  middleContainer2: {
    flex: 0.5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },  
  bottomContainer: {
    flex: 0.5,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  allowButton: {
    backgroundColor: '#ff5252',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 140,
    marginBottom: 50,
    elevation: 5
  },
  allowButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center'
  },
});

export default LocationPermissionScreen;