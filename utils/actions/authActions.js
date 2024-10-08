import { getFirebaseApp } from "../firebaseHelper";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { child, getDatabase, set, ref } from "firebase/database";
import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authenticate } from "../../store/authSlice";
import { getUserData } from "./userActions";
import { clearAuth } from "../../store/authSlice";

//Sign Up Hook
export const signUp = (
  userName,
  email,
  password,
  role,
  fullName,
  phoneNumber,
  address,
  nic,
  dateOfBirth,
  education,
  hospital,
  jobStart
) => async (dispatch) => {
  const app = getFirebaseApp();
  const auth = getAuth(app);

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    const { uid, stsTokenManager } = result.user;
    const { accessToken, expirationTime } = stsTokenManager;
    const expiryDate = new Date(expirationTime);

   
    const medicalRecords = [];

    const userData = await createUser(
      userName,
      email,
      password,
      role,
      fullName,
      phoneNumber,
      address,
      nic,
      dateOfBirth,
      education,
      hospital,
      jobStart,
      uid,
      medicalRecords 
    );

    dispatch(authenticate({ token: accessToken, userData }));

    saveToDataStorage(accessToken, uid, expiryDate);
  } catch (error) {
    console.log(error);

    const errorCode = error.code;
    let message = "Something went wrong";

    if (
      errorCode === "auth/wrong-password" ||
      errorCode === "auth/user-not-found"
    ) {
      message = "Wrong email or password";
    }

    if (errorCode === "auth/email-already-in-use") {
      message = "Email already in use";
    }

    throw new Error(message);
  }
};


//Sign In Hook
export const signIn = (email, password) => {
  return async (dispatch) => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      const { uid, stsTokenManager } = result.user;
      const { accessToken, expirationTime } = stsTokenManager;
      const expiryDate = new Date(expirationTime);

      const userData = await getUserData(uid);

      dispatch(authenticate({ token: accessToken, userData }));

      saveToDataStorage(accessToken, uid, expiryDate);

      return { userData };
    } catch (error) {
      console.log(error);

      const errorCode = error.code;
      let message = "Something went wrong";

      if (
        errorCode === "auth/wrong-password" ||
        errorCode === "auth/user-not-found"
      ) {
        message = "Wrong email or password";
      }

      if (errorCode === "auth/invalid-credential") {
        message = "Please check your email or password";
      }

      throw new Error(message);
    }
  };
};


//logout
export const logout = async (dispatch, navigation) => {
  const auth = getAuth();

  try {
    await signOut(auth);
    await AsyncStorage.removeItem("userData");

    dispatch(clearAuth());

    navigation.navigate("Default Home");
  } catch (error) {
    console.error("Logout error:", error);
  }
};


const createUser = async (
  userName,
  email,
  password,
  role,
  fullName,
  phoneNumber,
  address,
  nic,
  dateOfBirth,
  education,
  hospital,
  jobStart,
  userId,
  medicalRecords 
) => {
  let userData = {
    userName,
    email,
    password,
    role,
    fullName,
    phoneNumber,
    address,
    nic,
    dateOfBirth,
    education,
    hospital,
    jobStart,
    userId,
    signUpDate: new Date().toISOString(),
    medicalRecords, 
  };

  
  Object.keys(userData).forEach(key => {
    if (userData[key] === undefined) {
      delete userData[key];
    }
  });

  const dbRef = ref(getDatabase());
  const childRef = child(dbRef, `user/${userId}`);
  await set(childRef, userData);

  return userData;
};



const saveToDataStorage = (token, userId, expiryDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expiryDate: expiryDate.toISOString(),
    })
  );
};
