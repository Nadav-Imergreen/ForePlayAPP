import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform, StyleSheet, View, Text, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { saveUserLocation } from "./firebaseDatabase";
import {useNavigation} from '@react-navigation/native';

const LocationPermissionScreen = () => {

  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setLoading(true); // Show loader/spinner
    Geolocation.getCurrentPosition(
        position => {
            setLoading(false); // Hide loader/spinner
            const { latitude, longitude } = position.coords;
            console.log('Latitude:', latitude, 'Longitude:', longitude);
            setCurrentLocation({ latitude, longitude });
            saveUserLocation({ latitude, longitude });
            navigation.navigate("TabNavigator");
        },
        error => {
            setLoading(false); // Hide loader/spinner
            console.log(error.code, error.message);
            Alert.alert(
                'Location Error',
                'Failed to get your current location. Please try again later.',
                [{ text: 'OK', onPress: () => navigation.navigate('UserInfoScreen') }]
            );
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 100000 }
    );
};


  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderContainer}>
            <View>
                <ActivityIndicator size={50} color="#0000ff" />
            </View>
        </View>
      )}
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
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.allowButton} onPress={requestLocationPermission}>
          <Text style={styles.allowButtonText}>Allow</Text>
        </TouchableOpacity>
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
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
  middleContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIcon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#c7d7e2",
  },
  locationImage: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  allowButton: {
    backgroundColor: '#ff5252',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 140,
    marginBottom: 50
  },
  allowButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
},
  loaderBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(215, 215, 215, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
},
});

export default LocationPermissionScreen ;