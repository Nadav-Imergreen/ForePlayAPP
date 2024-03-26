import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    sendEmailVerification,
    signInWithCredential,
    signInWithEmailAndPassword, signOut,
    FacebookAuthProvider
} from 'firebase/auth';
import {auth} from './config';
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
export const signup = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
        );
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export const emailVerification = async () => {
    const user = auth.currentUser;

    try {
        await sendEmailVerification(user, {
            handleCodeInApp: true,
            url: 'https://foreplay-dating-app.firebaseapp.com', // Add the protocol
        }).then(() => {
            console.log('email verify: ', user.email)
        });

    } catch (error) {
        console.error('Email verification error:', error.code, error.message);
        throw error;
    }
};

export const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('INFO: User signed in: userID: ', user.uid);
            return user;
        }).catch((error) => console.log(error.message));
};

const WEB_CLIENT_ID = "492193713065-v13i3q8p0e0f72fe5pm0mhhrmrv3np1g.apps.googleusercontent.com";
GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
});
export const googleSignIn = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();
    // Create a Google credential with the token
    const credential = GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    return (await signInWithCredential(auth, credential)).user;
}

export const signInWithFB = async () => {

    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) throw 'User cancelled the login process';

    // Once signed in, get the users AccessToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) throw 'Something went wrong obtaining access token';

    // Create a Firebase credential with the AccessToken
    const facebookCredential = FacebookAuthProvider.credential(data.accessToken);

    // Sign-in the user with the credential
    return ((await signInWithCredential(auth, facebookCredential)).user);
}

export const handleSignOut = () => {
    signOut(auth).catch((error) => console.error('Sign out error:', error.message))
};

