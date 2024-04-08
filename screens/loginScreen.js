import React, {useState, useEffect} from 'react';
import {
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    View,
    Pressable,
    useWindowDimensions,
    StyleSheet,
    I18nManager,
    PixelRatio,
    Dimensions,
    ImageBackground
} from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import {useNavigation} from '@react-navigation/native';
import {login} from '../services/auth';
import Loader from '../services/loadingIndicator';
import CustomFloatingLabelInput from '../components/CustomFloatingLabelInput'

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showEmailMessage, setShowEmailMessage] = useState(false);
    const pixelDensity = PixelRatio.get();
    const logoSize = 30;

    const { width, height } = useWindowDimensions();
    const isRTL = I18nManager.isRTL;

    // Calculate the scaled width and height based on the desired dimensions in dp
    const scaledWidth = pixelDensity * 1.98 * logoSize;
    const scaledHeight = pixelDensity * 1 * logoSize;

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
                        padding: 30,
                        width: '90%',
                        borderRadius: 20,
                        borderColor: 'grey',
                        borderWidth: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    }}>


                       
                        <CustomFloatingLabelInput
                                    label="Email Address"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                    

                    
                        <CustomFloatingLabelInput
                                    label="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={true}
                                />
                        

                        <View style={{ marginTop: 40, height: 50 }}>
                            {loading ? (
                                <Loader />
                            ) : (
                                <TouchableOpacity
                                    onPress={handleLogin}>
                                    <Text style={[pageStyles.buttonText, { width: FIELD_WIDTH }]}>Login</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={{
                            marginTop: 10,
                            ...renderTextOrder()
                        }}>
                            <Text>Don't have an account? </Text>
                            <TouchableOpacity onPress={handleNavigation}>
                                <Text style={{ fontWeight: 'bold' }}>SignUp</Text>
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
    },
    backgroundStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        resizeMode: 'stretch',
        alignItems: 'center'
    }
});

export default LoginScreen;
