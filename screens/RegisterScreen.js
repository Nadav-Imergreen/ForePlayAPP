import React, {useState} from 'react';
import {
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    PixelRatio,
    StyleSheet,
    I18nManager,
    useWindowDimensions
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {googleSignIn, signup} from '../services/auth';
import {saveUser} from '../services/firebaseDatabase';
import Loader from '../services/loadingIndicator';
import styles from '../cssStyles/commonStyles';
import {SocialIcon} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import COLORS from '../constants/colors';
import GoogleIcon from '@mui/icons-material/Google';
import ShopIcon from '@mui/icons-material/Shop';

const RegisterScreen = () => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordConfirmation, setPasswordConfirmation] = useState();
    const [loading, setLoading] = useState(false);
    const pixelDensity = PixelRatio.get();
    const navigation = useNavigation();
    const logoSize = 30;
    const { width, height } = useWindowDimensions();
    const isRTL = I18nManager.isRTL;

    
    // Define constants dimensions
    const FIELD_WIDTH = width * 0.7;
    const FIELD_HEIGHT = height * 0.6;

    // Calculate the scaled width and height based on the desired dimensions in dp
    const scaledWidth = pixelDensity * 1.98 * logoSize;
    const scaledHeight = pixelDensity * 1 * logoSize;

    // Checks if the passwords are the same
    const passwordsMatch = () => {
        return password === passwordConfirmation;
      };


    const handleSignup = async () => {
        setLoading(true);
        try {
            if (!passwordsMatch()) {
                alert('Passwords do not match. Please make sure the passwords match.');
                return;
              }

            const user = await signup(email, password);
            if (user) await saveUser(user.uid, email);
        } catch (error) {
            if (error.code === 'auth/email-already-in-use')
                alert('Email already in use. Please choose a different email.');
            else if (error.code === 'auth/invalid-email')
                alert('That email address is invalid!');
            else if (error.code === 'auth/weak-password')
                alert('Weak password. Please choose a stronger password.');
            else
                alert('Signup error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setLoading(true);
        try {
            const user = await googleSignIn();
            if (user) await saveUser(user.uid, user.email);
        } catch (error) {console.log('WARNING: google registration fails', error);
        } finally {setLoading(false)}
    };


    return(
        <View style={{ flex: 1, backgroundColor: 'white' }}>
        <LinearGradient
          colors={[
            '#FFFFFF', '#FFFFFF', '#FFFFFF',
            '#a4cdbd', '#a4cdbd', '#a4cdbd',
            '#f06478', '#f06478', '#f06478',
          ]}
          start={{ x: 0.9, y: 0 }}
       
          style={{ flex: 1, alignItems: 'center' }}>
      
          <View style={{ alignItems: 'center', paddingBottom: '10%' }}>
            <Image source={require('../assets/logo_small.png')} style={{ width: scaledWidth, height: scaledHeight }} />
          </View>
      
          <View style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 20,
            width: '90%',
            borderRadius: 20,
            borderColor: 'grey',
            borderWidth: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
          }}>
      
            <View style={{ marginBottom: 10 }}>
              <Text style={pageStyles.label}>Email address</Text>
              <TextInput
                style={[pageStyles.input, { width: FIELD_WIDTH }]}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
      
            <View style={{ marginBottom: 10 }}>
              <Text style={pageStyles.label}>Password</Text>
              <TextInput
                style={[pageStyles.input, { width: FIELD_WIDTH }]}
                placeholder="Enter your password"
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text style={pageStyles.label}>Confirm Password</Text>
              <TextInput
                style={[pageStyles.input, { width: FIELD_WIDTH }]}
                placeholder="Re-enter password to confirm"
                secureTextEntry
                autoCapitalize="none"
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
              />
            </View>
      
            <View style={{ marginTop: 20, height: 50 }}>
              {loading ? (
                <Loader />
              ) : (
                <TouchableOpacity
                  onPress={handleSignup}>
                  <Text style={[pageStyles.buttonText, { width: FIELD_WIDTH }]}>Sing Up</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={{flexDirection: 'row', alignItems: "center", marginVertical: 20}}>
                <View style={{flex: 1, height: 1, backgroundColor: COLORS.black, marginHorizontal: 10}}
                />
                <Text>Or Sign Up with</Text>
                <View style={{flex: 1, height: 1, backgroundColor: COLORS.black, marginHorizontal: 10}}
                />
            </View>

            <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        onPress={() => console.log("Pressed")}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            height: 52,
                            borderWidth: 1,
                            borderColor: COLORS.black,
                            marginRight: 4,
                            borderRadius: 10
                        }}
                    >
                        <Image
                            source={require("../assets/facebook.png")}
                            style={{
                                height: 36,
                                width: 36,
                                marginRight: 8
                            }}
                            resizeMode='contain'
                        />

                        <Text>Facebook</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleGoogleSignup}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            height: 52,
                            borderWidth: 1,
                            borderColor: COLORS.black,
                            marginRight: 4,
                            borderRadius: 10
                        }}
                    >
                        <Image
                            source={require("../assets/google.png")}
                            style={{
                                height: 36,
                                width: 36,
                                marginRight: 8
                            }}
                            resizeMode='contain'
                        />

                        <Text>Google</Text>
                    </TouchableOpacity>
                </View>

          </View>
          
        </LinearGradient>
      </View>

    );

    /*
    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.content}>
                    <Image source={require('../assets/logo.png')} style={styles.image}/>
                    <Text style={styles.title}>Register</Text>

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
                        <Loader/>
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
                            <SocialIcon type="google" onPress={() => handleGoogleSignup()}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
    */
};

const pageStyles = StyleSheet.create({
    input: {
      borderWidth: 2,
      borderColor: 'gray',
      borderRadius: 12,
      padding: 7,
      fontSize: 16,
      color: 'black',
      backgroundColor: 'white'
    },
    label: {
        fontSize: 16,
        marginBottom: 2,
        color: 'black',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        borderRadius: 12,
        borderColor: 'black',
        borderWidth: 1,
        padding: 12,
        backgroundColor: '#a4cdbd',
        textAlign: 'center'
    }
  });

export default RegisterScreen;
