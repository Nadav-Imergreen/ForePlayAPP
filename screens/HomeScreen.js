import React, {useState} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {signOut} from 'firebase/auth';
import {useNavigation} from '@react-navigation/native';
import Loader from '../services/loadingIndicator';
import {auth} from '../services/config';

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  console.log(auth);
  const handleSignOut = () => {
    try {
      setLoading(true);
      signOut(auth).then(() => {
        navigation.navigate('Login');
      });
    } catch (error) {
      console.error('Sign out error:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen!</Text>
      {loading ? (
        <Loader />
      ) : (
        <Button title="Sign Out" onPress={handleSignOut} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default HomeScreen;
