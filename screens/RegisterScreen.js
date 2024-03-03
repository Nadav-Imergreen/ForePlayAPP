// RegisterScreen.js

import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {signup} from '../services/auth';
import {saveUserData} from '../services/firebaseDatabase';
import Loader from '../services/loadingIndicator';
import styles from '../cssStyles/commonStyles';
import {SocialIcon} from 'react-native-elements';

const RegisterScreen = () => {
  const [email, setEmail] = useState('test@gmail.com');
  const [password, setPassword] = useState('123456');
  const [firstname, setFirstname] = useState('a');
  const [lastname, setLastname] = useState('b');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleSignup = async () => {
    setLoading(true);

    try {
      const user = await signup(email, password);

      if (user) {
        const id = user.uid;
        await saveUserData(id, firstname, lastname);
      }
    } catch (error) {
      setLoading(false);

      if (error.code === 'auth/email-already-in-use') {
        alert('Email already in use. Please choose a different email.');
      } else if (error.code === 'auth/weak-password') {
        alert('Weak password. Please choose a stronger password.');
      } else {
        alert('Signup error: ' + error.message);
      }
    }
  };

  // import {GoogleSignin} from '@react-native-google-signin/google-signin';
  // import auth from '@react-native-firebase/auth';

  // const WEB_CLIENT_ID="492193713065-v13i3q8p0e0f72fe5pm0mhhrmrv3np1g.apps.googleusercontent.com";
  // GoogleSignin.configure({
  //   webClientId:WEB_CLIENT_ID,
  // });

  const  handleGoogleSignup = async () => {
    setLoading(true);
    // Get the users ID token
    // const { idToken } = await GoogleSignin.signIn();

    // // Create a Google credential with the token
    // const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    //
    // // Sign-in the user with the credential
    // const userSignIn = auth().signInWithCredential(googleCredential);
    //
    // userSignIn.then((user)=>{
    //   console.log(user);})
    //     .catch((error)=>{
    //       console.log(error);
    //       setLoading(false);
    //     })
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.content}>
          <Image source={require('../assets/logo.png')} style={styles.image} />
          <Text style={styles.title}>Register</Text>

          <TextInput
            style={styles.input}
            placeholder="Firstname"
            autoCapitalize="none"
            value={firstname}
            onChangeText={setFirstname}
          />
          <TextInput
            style={styles.input}
            placeholder="Lastname"
            autoCapitalize="none"
            value={lastname}
            onChangeText={setLastname}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />

          {loading ? (
            <Loader />
          ) : (
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleSignup}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.title5}>
              Already have an account? Login here.
            </Text>

            <View style={styles.socialIconContainer}>
              <SocialIcon type="google" onPress={() => handleGoogleSignup()} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
