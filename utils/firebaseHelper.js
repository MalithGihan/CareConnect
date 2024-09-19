import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

let firebaseApp;

export const getFirebaseApp = () => {
    if (firebaseApp) {
        return firebaseApp;
    }

    const firebaseConfig = {
        apiKey: "AIzaSyAIHh6eD2AQ2_QseG48dGDubp8MgCDS1SM",
        authDomain: "careconnect-bbec7.firebaseapp.com",
        projectId: "careconnect-bbec7",
        storageBucket: "careconnect-bbec7.appspot.com",
        messagingSenderId: "479004028518",
        appId: "1:479004028518:web:12d14e720d5487ae2a87a7",
        measurementId: "G-FMB43FBLM7"
    };

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

    initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });

    firebaseApp = app;

    return app;
};



