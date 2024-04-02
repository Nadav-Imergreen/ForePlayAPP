import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, Image, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const UploadImage = ({ setImageUrls, imageUrls }) => {
   

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
    
           
            setImageUrls([...imageUrls, uri]); // Update the image URLs state in the parent component
      
        }
    };

    const deleteImage = (index) => {
        const newImageUris = [...imageUrls];
        newImageUris.splice(index, 1);
    
        setImageUrls(newImageUris); // Update the image URLs state in the parent component
    };

    return (
        <View style={styles.container}>
            {Array.from({ length: 6 }, (_, index) => {
                const uri = imageUrls[index];
                return (
                    <TouchableOpacity key={index} onPress={uri ? () => deleteImage(index) : chooseImage} style={styles.imageContainer}>
                        {uri ? (
                            <Image source={{ uri }} style={styles.image} />
                        ) : (
                            <View style={styles.placeholder}>
                                <Text style={styles.plus}>+</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    imageContainer: {
        width: 100,
        height: 100,
        margin: 5,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    placeholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    plus: {
        fontSize: 40,
        color: 'red',
    },
});

export default UploadImage;