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
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
    ImageBackground
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {facebookSignIn, googleSignIn, signInWithFB, signup} from '../services/auth';
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
    const vw = width / 100;

    
    // Define constants dimensions
    const FIELD_WIDTH = width * 0.7;
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
            <View style={{ flex: 1, backgroundColor: 'white' }}>

            <ImageBackground source={require('../assets/background.png')} style={pageStyles.backgroundStyle}>

        
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
                    <Text style={[pageStyles.label, { fontSize: vwFontSize(4) }]}>Email address</Text>
                        <TextInput
                        style={[pageStyles.input, { width: FIELD_WIDTH, fontSize: vwFontSize(4), padding: vwFontSize(1), }]}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                        />
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={[pageStyles.label, { fontSize: vwFontSize(4) }]}>Password</Text>
                    <TextInput
                        style={[pageStyles.input, { width: FIELD_WIDTH, fontSize: vwFontSize(4), padding: vwFontSize(1) }]}
                        placeholder="Enter your password"
                        secureTextEntry
                        autoCapitalize="none"
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={[pageStyles.label, { fontSize: vwFontSize(4) }]}>Confirm Password</Text>
                    <TextInput
                        style={[pageStyles.input, { width: FIELD_WIDTH, fontSize: vwFontSize(4), padding: vwFontSize(1) }]}
                        placeholder="Re-enter password to confirm"
                        secureTextEntry
                        autoCapitalize="none"
                        value={passwordConfirmation}
                        onChangeText={setPasswordConfirmation}
                    />
                </View>
        
                <View style={{ marginTop: vwFontSize(3), height: 50 }}>
                {loading ? (
                    <Loader />
                ) : (
                    <TouchableOpacity
                    onPress={handleSignup}>
                    <Text style={[pageStyles.buttonText, { width: FIELD_WIDTH, fontSize: vwFontSize(4), padding: vwFontSize(2) }]}>Sing Up</Text>
                    </TouchableOpacity>
                )}
                </View>

                <View style={{flexDirection: 'row', alignItems: "center", marginBottom: vwFontSize(3)}}>
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
                            onPress={handleGoogleSignup}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                padding: vwFontSize(1),
                                marginHorizontal: 60,
                                borderWidth: 1,
                                borderColor: COLORS.black,
                                backgroundColor: COLORS.white,
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
            </ImageBackground>
            
        </View>
      </TouchableWithoutFeedback>

    );
};

const pageStyles = StyleSheet.create({
    input: {
      borderWidth: 2,
      borderColor: 'gray',
      borderRadius: 12,
      paddingHorizontal: 10,
      color: 'black',
      backgroundColor: 'white'
    },
    label: {
        marginBottom: 2,
        color: 'black',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        borderRadius: 12,
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: '#a4cdbd',
        textAlign: 'center'
    },
    backgroundStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        resizeMode: 'stretch',
        alignItems: 'center'
    }
    
  });

export default RegisterScreen;
