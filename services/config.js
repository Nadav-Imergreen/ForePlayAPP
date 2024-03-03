// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB-zobkm6c9L0kewge7s-0fqBcTajf9pFA',
  authDomain: 'foreplay-dating-app.firebaseapp.com',
  projectId: 'foreplay-dating-app',
  storageBucket: 'foreplay-dating-app.appspot.com',
  messagingSenderId: '492193713065',
  appId: '1:492193713065:web:b6a910dc08e32cd5d3d2b8',
  measurementId: 'G-NHW9QC0KXB',
  webClientId:
    '492193713065-v13i3q8p0e0f72fe5pm0mhhrmrv3np1g.apps.googleusercontent.com',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // init the auth module
export const db = getFirestore(app);
export const storage = getStorage(app);
