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
import {googleSignIn, signup} from '../services/auth';
import {saveUser} from '../services/firebaseDatabase';
import Loader from '../services/loadingIndicator';
import styles from '../cssStyles/commonStyles';
import {SocialIcon} from 'react-native-elements';

const RegisterScreen = () => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const handleSignup = async () => {
        setLoading(true);
        try {
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
};

export default RegisterScreen;
