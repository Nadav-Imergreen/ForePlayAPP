import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker } from 'react-native-maps';

const LocationPicker = ({ onLocationSelect }) => {
    const [region, setRegion] = useState(null);
    const [marker, setMarker] = useState(null);

    useEffect(() => {
        
        // Set Israel as default position regardless of Geolocation result
        setRegion({
            latitude: 32.0000, // Latitude of Israel
            longitude: 34.8516, // Longitude of Israel
            latitudeDelta: 1.2, // Adjusted for more zoomed-in view
            longitudeDelta: 1.2, // Adjusted for more zoomed-in view
        });

        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setRegion({
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
                setMarker({
                    latitude: latitude,
                    longitude: longitude,
                });
            },
            error => {
                console.error(error);
            },
            { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
        );
    }, []);

    const handleMapPress = event => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setMarker({ latitude, longitude });
    };

    const handleConfirm = () => {
        if (marker) {
            onLocationSelect(marker);
        }
    };

    return (
        <View style={styles.container}>
          <View style={styles.mapContainer}>
            <MapView
            style={styles.map}
            initialRegion={region}
            onPress={handleMapPress}
            >
            {marker && <Marker coordinate={marker} />}
            </MapView>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.allowButton} onPress={handleConfirm}>
                <Text style={styles.allowButtonText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
      };
      
      const styles = StyleSheet.create({
        container: {
          flex: 1,
        },
        mapContainer: {
          flex: 1,
        },
        map: {
          ...StyleSheet.absoluteFillObject,
          margin: 10,
        },
        buttonContainer: {
          marginBottom: 20,
          paddingHorizontal: 10,
        },
        allowButton: {
            backgroundColor: '#ff5252',
            borderRadius: 10,
            paddingVertical: 8,
          },
          allowButtonText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center'
          },
      });

export default LocationPicker;