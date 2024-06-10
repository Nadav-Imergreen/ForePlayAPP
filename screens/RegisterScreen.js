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
    useWindowDimensions,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
    ImageBackground
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {googleSignIn, signInWithFB, signup} from '../services/auth';
import {saveUser} from '../services/Databases/users';
import Loader from '../services/loadingIndicator';
import COLORS from '../constants/colors';
import CustomFloatingLabelInput from '../components/CustomFloatingLabelInput'


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
    const vw = width / 100;


    // Define constants dimensions
    const FIELD_WIDTH = width * 0.8;
    const FIELD_HEIGHT = height * 0.6;

    // Calculate the scaled width and height based on the desired dimensions in dp
    const scaledWidth = pixelDensity * 1.98 * logoSize;
    const scaledHeight = pixelDensity * 1 * logoSize;

    // Calculates font size in logical pixels (dp) based on viewport width (vw).
    const vwFontSize = (size) => {
        const scaledFontSize = vw * size;
        return PixelRatio.roundToNearestPixel(scaledFontSize);
    };

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

    const handleFacebookSignup = async () => {
        setLoading(true);
        try {
            const user = await signInWithFB();
            if (user) await saveUser(user.uid, user.email);
        } catch (error) {console.log('WARNING: facebook registration fails', error);
        } finally {setLoading(false)}
    };



    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={{ alignItems: 'center', paddingBottom: '10%' }}>
                    <Image source={require('../assets/logo_small.png')} style={{ width: scaledWidth, height: scaledHeight }} />
                </View>

                <Text style={styles.title}>Create your Account</Text>
                <TextInput style={styles.input} placeholder="Email" onChangeText={text => setEmail(text.trim())} keyboardType="email-address"/>
                <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} />
                <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry onChangeText={setPasswordConfirmation}/>
                
                {loading ? (
                    <Loader />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleSignup}>
                        <Text style={styles.buttonText}>Sign up</Text>
                    </TouchableOpacity>
                )}
                

                <Text style={{marginTop: 50}}>Or Sign Up with</Text>


                <View style={styles.socialContainer}>
                    <TouchableOpacity onPress={handleGoogleSignup} style={styles.socialButton}>
                        <Image
                            source={require("../assets/google.png")}
                            style={styles.socialIcon}
                            resizeMode='contain'
                        />

                        <Text style={styles.socialText}>Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleGoogleSignup} style={styles.socialButton}>
                        <Image
                            source={require("../assets/facebook.png")}
                            style={styles.socialIcon}
                            resizeMode='contain'
                        />
                        <Text style={styles.socialText}>Facebook</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', // Center content horizontally
        backgroundColor: 'white',
        paddingTop: 100
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 20,
        marginRight: 150
      },
      input: {
        width: '80%',
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 20,
        marginBottom: 10,
      },
      button: {
        width: '80%',
        height: 45,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        marginBottom: 20,
        elevation: 5
      },
      buttonText: {
        color: '#ff6f61',
        fontWeight: 'bold',
      },
      socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        paddingHorizontal: 40,
        marginTop: 20
      },
      socialButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'lightgrey',
        backgroundColor: COLORS.white,
        borderRadius: 30,
        paddingVertical: 10,
        marginHorizontal: 10,
      },
      socialIcon: {
        height: 25,
        width: 25,
        marginRight: 8
      },
      socialText: {
        fontSize: 16,
        color: 'black'
      }

});

export default RegisterScreen;
