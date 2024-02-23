// RegisterScreen.js

import React, {useEffect, useState} from 'react';
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
import {saveUserData} from '../services/firebaseDatabase'; // Update the path
import Loader from '../services/loadingIndicator';
import styles from '../cssStyles/commonStyles';
import {SocialIcon} from 'react-native-elements';
//import { GoogleSignin } from '@react-native-google-signin/google-signin';
//import auth from '@react-native-firebase/auth';
//import firebase from "firebase/compat";
// import {WEB_CLIENT_ID} from '@env';

const RegisterScreen = () => {
  const [email, setEmail] = useState('test@gmail.com');
  const [password, setPassword] = useState('123456');
  const [firstname, setFirstname] = useState('a');
  const [lastname, setLastname] = useState('b');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  // const WEB_CLIENT_ID="492193713065-v13i3q8p0e0f72fe5pm0mhhrmrv3np1g.apps.googleusercontent.com"
  // GoogleSignin.configure({
  //     webClientId: WEB_CLIENT_ID,
  // });

  const handleSignup = async () => {
    setLoading(true);

    try {
      const user = await signup(email, password);

      if (user) {
        const id = user.uid;
        // await saveUserData(id, firstname, lastname);
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

  //  const googleAuth = async () => {
  //
  //     // Check if your device supports Google Play
  //     await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
  //     // Get the users ID token
  //     const {idToken} = await GoogleSignin.signIn();
  //
  //     // Create a Google credential with the token
  //     const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  //
  //     // Sign-in the user with the credential
  //     return auth().signInWithCredential(googleCredential);
  // };

  const googleLogin = async () => {
    //     try {
    //         const result = await Expo.Google.logInAsync({
    //             androidClientId: "Your Client ID",
    //             //iosClientId: YOUR_CLIENT_ID_HERE,  <-- if you use iOS
    //             scopes: ["profile", "email"]
    //
    //         })
    //         if (result.type === "success") {
    //             const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken);
    //             firebase.auth().signInAndRetrieveDataWithCredential(credential).then(function(result){
    //                 console.log(result);
    //             });
    //             this.props.navigation.navigate('Where you want to go');
    //         } else {
    //             console.log("cancelled")
    //         }
    //     } catch (e) {
    //         console.log("error", e)
    //     }
  };

  const handleGoogleSignup = async () => {
    // setLoading(true);
    // try {
    //   const user = await googleLogin();
    //   if (user) {
    //     const id = user.uid;
    //     await saveUserData(id, firstname, lastname);
    //     // navigation.navigate('Login');
    //   }
    // } catch (error) {
    //   setLoading(false);
    //
    //   if (error.code === 'auth/email-already-in-use') {
    //     alert('Email already in use. Please choose a different email.');
    //   } else if (error.code === 'auth/weak-password') {
    //     alert('Weak password. Please choose a stronger password.');
    //   } else {
    //     alert('Signup error: ' + error.message);
    //   }
    // }
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
