import React, {useState} from 'react';
import {
    KeyboardAvoidingView,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {login, emailVerification} from '../services/auth';
import styles from '../cssStyles/commonStyles';
import Loader from '../services/loadingIndicator';

const LoginScreen = () => {
    const [email, setEmail] = useState('ff@gmail.com');
    const [password, setPassword] = useState('123456');
    const [loading, setLoading] = useState(false);
    const [showEmailMessage, setShowEmailMessage] = useState(false);

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

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={styles.content}>
                <Image source={require('../assets/logo.png')} style={styles.image}/>
                <Text style={styles.title}>Login</Text>

                {showEmailMessage ? (
                    <Text style={{color: 'red', paddingVertical: 5}}>
                        Email verification required. Please check your email inbox and
                        follow the instructions to verify your email address.
                    </Text>
                ) : null}

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
                        onPress={handleLogin}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.title5box} onPress={handleNavigation}>
                    <Text style={styles.title5}>Don't have an account? SignUp here.</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
