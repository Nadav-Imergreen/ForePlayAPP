import React from 'react';
import { StyleSheet, View } from 'react-native';
import UploadImage from '../components/UploadImage';

const HomeScreen = () => {
  return (
      <View style={styles.container}>
        <UploadImage />
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
