import React, {useState, useEffect} from 'react';
import {
    TextInput,
    Image,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    View,
    useWindowDimensions,
    StyleSheet,
    I18nManager,
    PixelRatio,
    Dimensions,
    ImageBackground
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {login} from '../services/auth';
import Loader from '../services/loadingIndicator';
import CustomFloatingLabelInput from '../components/CustomFloatingLabelInput'

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const pixelDensity = PixelRatio.get();
    const logoSize = 30;

    const { width, height } = useWindowDimensions();
    const isRTL = I18nManager.isRTL;

    // Calculate the scaled width and height based on the desired dimensions in dp
    const scaledWidth = pixelDensity * 1.98 * logoSize;
    const scaledHeight = pixelDensity * logoSize;

    // Define constants for image dimensions
    const FIELD_WIDTH = width * 0.7;
    const FIELD_HEIGHT = height * 0.6;

    const [cont, setCont] = useState('');
    const [show, setShow] = useState(false);


    // Determine text order based on text direction
    const renderTextOrder = () => {
        if (I18nManager.isRTL) {
            return { flexDirection: 'row-reverse' };
        } else {
            return { flexDirection: 'row' };
        }
    };

    const navigation = useNavigation();

    const handleNavigation = async () => {
        navigation.navigate('Register');
    };

    const handleLogin = async () => {
        setLoading(true);

        try {const user = await login(email, password);}
        catch (error) {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password')
                alert('WARNING: Invalid email or password. Please try again.');
            else if(error.code === 'auth/email-already-in-use')
                alert('That email address is already in use!')
            else if (error.code === 'auth/too-many-requests')
                alert('WARNING: Too many unsuccessful login attempts. Please try again later.');
            else
                alert('WARNING: Sign-in error: ' + error.message);

        } finally {setLoading(false);}
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
<>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={{ alignItems: 'center', paddingBottom: '10%' }}>
                    <Image source={require('../assets/logo_small.png')} style={{ width: scaledWidth, height: scaledHeight }} />
                </View>

                <Text style={styles.title}>Create your Account</Text>
                <TextInput style={styles.input} placeholder="Email" onChangeText={text => setEmail(text.trim())} placeholderTextColor="black" keyboardType="email-address"/>
                <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} placeholderTextColor="black"/>
                
                {loading ? (
                    <Loader />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Log in</Text>
                    </TouchableOpacity>
                )}

                <Text style={{marginTop: 50}}>Or Login with</Text>


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
        </>
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
        backgroundColor: "white",
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

export default LoginScreen;
