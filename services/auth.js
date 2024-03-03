import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {auth} from './config';

export const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    console.log('User registered:', user);

    // You can redirect the user to another screen or perform any additional actions here

    return user;
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
    });
    //.then(()=>{showEmailAlert(user.email)});

    // You can also show an alert or perform other actions on successful email verification
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error('Email verification error:', errorCode, errorMessage);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    console.log('User signed in:', user);
    return user;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

//import { signInWithPopup,signInWithCredential,  signInWithRedirect, GoogleAuthProvider, getAdditionalUserInfo } from "firebase/auth";

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { ANDROID_CLIENT_ID, IOS_CLIENT_ID, WEB_CLIENT_ID } from "@env";

// const signInRequest = () => {
//   BeginSignInRequest.builder()
//       .setGoogleIdTokenRequestOptions(
//           BeginSignInRequest.GoogleIdTokenRequestOptions.builder()
//               .setSupported(true)
//               .setServerClientId("492193713065-v13i3q8p0e0f72fe5pm0mhhrmrv3np1g.apps.googleusercontent.com")
//               // Only show accounts previously used to sign in.
//               .setFilterByAuthorizedAccounts(true)
//               .build())
//       .build()
// }

//
// export const googleAuth = async () => {
//
//         // Check if your device supports Google Play
//     await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
//     // Get the users ID token
//     const { idToken } = await GoogleSignin.signIn();
//
//     // Create a Google credential with the token
//     const googleCredential = auth.GoogleAuthProvider.credential(idToken);
//
//     // Sign-in the user with the credential
//     return auth().signInWithCredential(googleCredential);

//client IDs from .env

// const provider = new GoogleAuthProvider();

//   await signInWithPopup(auth, provider)
//     .then((result) => {
//         console.log("in signUp with google");
//         console.log(result.user);
//         console.log(getAdditionalUserInfo(result));
//
//         // This gives you a Google Access Token. You can use it to access the Google API.
//         const token = GoogleAuthProvider.credentialFromResult(result).accessToken;
//         const credential = GoogleAuthProvider.credential(token);
//         signInWithCredential(auth, credential);
//
//         // The signed-in user info.
//         const user = result.user;
//         return user;
//         // IdP data available using getAdditionalUserInfo(result)
//         // ...
//     }).catch((error) => {
//          console.log("in signUp with google error");
//     // Handle Errors here.
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // The email of the user's account used.
//     const email = error.customData.email;
//     // The AuthCredential type that was used.
//     const credential = GoogleAuthProvider.credentialFromError(error);
//     // ...
// });
// };

// export const signInWithGoogle = async () => {
//     try {
//         const config = {
//             webClientId: "492193713065-v13i3q8p0e0f72fe5pm0mhhrmrv3np1g.apps.googleusercontent.com",
//         };
//         const [request, response, promptAsync] = Google.useAuthRequest(config);
//
//         // Attempt to retrieve user information from AsyncStorage
//         const userJSON = await AsyncStorage.getItem("user");
//
//         if (userJSON) {
//             // If user information is found in AsyncStorage, parse it and set it in the state
//             setUserInfo(JSON.parse(userJSON));
//         } else if (response?.type === "success") {
//             // If no user information is found and the response type is "success" (assuming response is defined),
//             // call getUserInfo with the access token from the response
//             getUserInfo(response.authentication.accessToken);
//         }
//     } catch (error) {
//         // Handle any errors that occur during AsyncStorage retrieval or other operations
//         console.error("Error retrieving user data from AsyncStorage:", error);
//     }
// };
