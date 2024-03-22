import React, {useState} from 'react';
import {
    KeyboardAvoidingView,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Pressable,
    useWindowDimensions,
    StyleSheet,
    I18nManager 
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {login, emailVerification} from '../services/auth';
import styles from '../cssStyles/commonStyles';
import Loader from '../services/loadingIndicator';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showEmailMessage, setShowEmailMessage] = useState(false);

    const { width, height } = useWindowDimensions();
    const isRTL = I18nManager.isRTL;

    // Define constants for image dimensions
    const FIELD_WIDTH = width * 0.7;
    const FIELD_HEIGHT = height * 0.6;

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

<View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ alignItems: 'center' }}>
        <Image source={require('../assets/logo_small.png')} style={{ width: width * 0.6, height: height * 0.15, margin: 20}} />
      </View>

      <View style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
      }}>
        
        <View style={{ marginBottom: 20 }}>
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

        <View style={{ marginBottom: 20 }}>
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

        <View style={{marginTop: 20, height: 50}}>
            {loading ? (
                        <Loader/>
                    ) : (
                        <TouchableOpacity
                            
                            onPress={handleLogin}>
                            <Text style={[pageStyles.buttonText, { width: FIELD_WIDTH }]}>Login</Text>
                        </TouchableOpacity>
                    )}
        </View>

        <View style={{
            marginTop: 10,
            flexDirection: "row",
            }}>
            {isRTL ? (
                <>
                <TouchableOpacity onPress={handleNavigation}>
                    <Text style={{ fontWeight: 'bold' }}>SignUp</Text>
                </TouchableOpacity>
                <Text>Don't have an account? </Text>
                </>
            ) : (
                <>
                <Text>Don't have an account? </Text>
                <TouchableOpacity onPress={handleNavigation}>
                    <Text style={{ fontWeight: 'bold' }}>SignUp</Text>
                </TouchableOpacity>
                </>
            )}
        </View>
      </View>
    </View>

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
      
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
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

export default LoginScreen;
