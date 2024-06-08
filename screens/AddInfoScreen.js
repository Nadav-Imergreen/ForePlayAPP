import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Provider as PaperProvider } from 'react-native-paper';
import { saveExtraInfo } from '../services/Databases /users';

const AddInfoComponent = () => {
    const [aboutMe, setAboutMe] = useState('');
    const [desireMatch, setDesireMatch] = useState('');

    const handleAddInfo = async () => {
        if (aboutMe.trim() === '' || desireMatch.trim() === '') {
            Alert.alert('Error', 'Please fill in both fields.');
            return;
        }

        try {
            await saveExtraInfo(aboutMe, desireMatch);
            Alert.alert('Success', 'Information added successfully.');
            setAboutMe('');
            setDesireMatch('');
        } catch (error) {
            console.error('Error adding info to Firestore: ', error);
            Alert.alert('Error', 'Failed to add information. Please try again.');
        }
    };

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.title}>Add Information</Title>
                        <TextInput
                            mode="outlined"
                            label="About Me"
                            placeholder="Enter information about yourself"
                            value={aboutMe}
                            onChangeText={setAboutMe}
                            style={styles.input}
                        />
                        <TextInput
                            mode="outlined"
                            label="Desired Match"
                            placeholder="Describe your desired match"
                            value={desireMatch}
                            onChangeText={setDesireMatch}
                            style={styles.input}
                        />
                        <Button mode="contained" onPress={handleAddInfo} style={styles.button}>
                            Add Info
                        </Button>
                    </Card.Content>
                </Card>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 16,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    },
});

export default AddInfoComponent;
