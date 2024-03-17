import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/config';
import { saveUserData } from '../services/firebaseDatabase';
import Loader from '../services/loadingIndicator';
import UploadImage from "../components/UploadImage";

const UserInfoScreen = () => {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('Male'); // Default to Male
  const [hometown, setHometown] = useState('');
  const navigation = useNavigation();

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

  const handleSaveUserInfo = async () => {
    setLoading(true);
    try {
      const userId = auth.currentUser.uid;
      await saveUserData(userId, firstName, lastName, age, sex, hometown);
      setLoading(false);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving user data:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <View style={styles.radioGroup}>
        <Text>Sex:</Text>
        <View style={styles.radioOption}>
          <Button
            title="Male"
            onPress={() => setSex('Male')}
            color={sex === 'Male' ? 'blue' : 'gray'}
          />
        </View>
        <View style={styles.radioOption}>
          <Button
            title="Female"
            onPress={() => setSex('Female')}
            color={sex === 'Female' ? 'blue' : 'gray'}
          />
        </View>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Hometown"
        value={hometown}
        onChangeText={setHometown}
      />
      <UploadImage />
      {loading ? (
        <Loader />
      ) : (
        <Button title="Save User Info" onPress={handleSaveUserInfo} />
      )}
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioOption: {
    marginLeft: 10,
  },
});

export default UserInfoScreen;