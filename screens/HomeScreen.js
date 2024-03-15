import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ref, uploadBytes } from 'firebase/storage';
import {auth, storage} from '../services/config';
import {launchImageLibrary} from "react-native-image-picker";

const HomeScreen = () => {
  const [selectedImage, setSelectedImage] = useState('');

  const submitData = () => {
    const storageRef = ref(storage, 'image');

    // Define user metadata
    const metadata = {
      customMetadata: {
        userId: auth.currentUser.uid,
      },
    };

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, selectedImage, metadata).then((snapshot) => {
      if (selectedImage === '')
        console.log('please chose an image from library');
      else {
        console.log('Uploaded a blob or file!', snapshot.metadata);
        setSelectedImage('');
      }
    }).catch((error) => console.log(error.message));
  };

  const handleChange = async () => {

    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    const response = await launchImageLibrary(options);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
      }
  };

  return (
    <View style={styles.container}>
      <Text>Hello from Fid Screen!!</Text>
      <TouchableOpacity onPress={handleChange}><Text>Choose Image</Text></TouchableOpacity>
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

export default HomeScreen;