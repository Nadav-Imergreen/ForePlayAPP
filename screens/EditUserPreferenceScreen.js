import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import {Slider} from '@miblanchard/react-native-slider';

const EditUserPreferenceScreen = () => {
    const navigation = useNavigation();
    const [ageRange, setAgeRange] = useState([18, 50]); // Default age range
    const [gender, setGender] = useState('both'); // Default gender
    const [radius, setRadius] = useState(50); // Default radius

    const handleSave = () => {
        // Perform validation if needed
        // Save the user preferences
        // Navigate back to the previous screen
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Gender</Text>
            <Picker
                selectedValue={gender}
                style={styles.input}
                onValueChange={(itemValue) => setGender(itemValue)}
            >
                <Picker.Item label="Both" value="both" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
            </Picker>

            <Text style={styles.label}>Age Range</Text>
            <Slider
                style={styles.slider}
                minimumValue={18}
                maximumValue={100}
                step={1}
                value={ageRange}
                rangeEnabled
                minimumTrackTintColor="#007AFF"
                thumbTintColor="#007AFF"
                onValueChange={(value) => setAgeRange(value)}
            />
            <Text style={styles.ageRangeText}>{`${ageRange[0]} - ${ageRange[1]} years`}</Text>

            <Text style={styles.label}>Preferred Radius (in km)</Text>
            <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={100}
                step={1}
                value={radius}
                minimumTrackTintColor="#007AFF"
                thumbTintColor="#007AFF"
                onValueChange={(value) => setRadius(value)}
            />
            <Text style={styles.radiusText}>{`${radius} km`}</Text>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
    },
    slider: {
        marginBottom: 15,
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
});

export default EditUserPreferenceScreen;