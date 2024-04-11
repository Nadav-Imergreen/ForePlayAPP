import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { saveUserLocation } from "../services/firebaseDatabase";

const getLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission granted');
          getCurrentLocation();
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
        console.log('Error requesting location permission');
      }
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        saveUserLocation(currentLocation);
        console.log('Latitude:', latitude, 'Longitude:', longitude);
      },
      error => {
        console.log(error.code, error.message);
        console.log('Error getting current location');
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 100000 }
    );
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return { currentLocation };
};

export default getLocation;