import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';


const UploadImage = ({ setImageUrl }) => {
    const [imageUri, setImageUri] = useState('');

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
            setImageUri(uri);
            setImageUrl(uri); // Update the image URL state in the parent component
        }
    };

    return (
        <TouchableOpacity onPress={chooseImage} style={styles.imageContainer}>
            {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
                <Text style={styles.addPhotoText}>Add Photo</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    addPhotoText: {
        fontSize: 16,
        color: 'black',
    },
});

export default UploadImage;