import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {ref as storageRef, uploadBytes, getDownloadURL} from 'firebase/storage';
import {auth, storage} from '../services/config';
import {launchImageLibrary} from "react-native-image-picker";
import {saveUrl} from '../services/firebaseDatabase';

const UploadImage = () => {
    const [selectedImage, setSelectedImage] = useState('');
    const [imageUrl, setImageUrl] = useState(undefined);


    const submitData = () => {
        console.log("CHECK: selectedImage: ", selectedImage);
        const imageRef = storageRef(storage, `images/${selectedImage}`);

        // Define user metadata
        const metadata = {
            customMetadata: {
                userId: auth.currentUser.uid,
            },
        };

        uploadBytes(imageRef, selectedImage, metadata)
            .then((snapshot) => {
            if (selectedImage === '')
                throw Error('WARNING: please chose an image from library');

            console.log('INFO: Uploaded an image!', snapshot.metadata);
            setSelectedImage('');
            getDownloadURL(snapshot.ref)
                .then((url) => saveUrl(url))
                .catch((error) => console.log(error.message));
        }).catch((error) => console.log(error.message));
    };

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
            const imageUri = response.uri || response.assets?.[0]?.uri;
            setSelectedImage(imageUri);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={chooseImage}><Text>Choose Image</Text></TouchableOpacity>
            <TouchableOpacity onPress={submitData}><Text>Upload Photo</Text></TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default UploadImage;
