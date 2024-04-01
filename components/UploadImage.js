import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { saveUrl } from '../services/firebaseDatabase';
import { storage } from '../services/config';

const UploadImage = () => {
    const [imageUrl, setImageUrl] = useState('');

    const chooseImage = async () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        const response = await launchImageLibrary(options);
        if (response.didCancel) {
            console.log('WARNING: User cancelled image picker');
        } else if (response.errorCode) {
            console.log('WARNING: ImagePicker Error: ', response.errorMessage);
        } else {
            const uri = response.assets?.[0]?.uri;
            setImageUrl(uri);
        }
    };

    const submitData = async () => {

        if (!imageUrl) {
            alert('WARNING: Please choose an image from the library');
            return;
        }

        const imageRef = storageRef(storage, `images/${imageUrl}`);

        try {
            const blob = await fetch(imageUrl).then((res) => res.blob());
            console.log('INFO: Successfully fetched photo using URL');

            const snapshot = await uploadBytes(imageRef, blob);
            console.log('INFO: Uploaded an image!', snapshot.metadata.name);

            setImageUrl('');

            const url = await getDownloadURL(snapshot.ref);
            await saveUrl(url);
        } catch (error) {
            console.error('ERROR: Failed to upload image', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={chooseImage}>
                <Text style={styles.buttonText}>Choose Image</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={submitData}>
                <Text style={styles.buttonText}>Upload Photo</Text>
            </TouchableOpacity>
        </View>
    );
}

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
        },
        buttonText: {
            fontSize: 18,
            color: 'black',
            textAlign: 'center',
            padding: 10,
            marginBottom: 10,
        },
    });


export default UploadImage;
