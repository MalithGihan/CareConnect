import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import { useNavigation } from "@react-navigation/native";
import { reducer } from "../../utils/reducers/formReducers";
import { validateInput } from "../../utils/actions/formActions";
import { useDispatch } from "react-redux";
import { signIn } from "../../utils/actions/authActions";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

const initialState = {
  inputValues: {
    email: "",
    password: "",
  },
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

export default SignIn = () => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [error, setError] = useState();

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result || null,
        inputValue,
      });
    },
    [dispatchFormState]
  );

  const authHandler = async () => {
    try {
      setIsLoading(true);
      const result = await dispatch(
        signIn(formState.inputValues.email, formState.inputValues.password)
      );
      const { userData } = result;

      setError(null);
      setIsLoading(false);

      if (userData.role === "healthProvider") {
        navigation.navigate("Home Healthcare Provider");
      } else if (userData.role === "doctor") {
        navigation.navigate("Home Doctor");
      } else {
        navigation.navigate("Home Patient");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred", error);
    }
  }, [error]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#D9E4EC", padding: 16 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Adjust as necessary
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableOpacity onPress={() => navigation.navigate("Default Home")}>
          <Ionicons name="arrow-back-circle" size={40} color="#003366" />
        </TouchableOpacity>

        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Text
            style={{
              color: "#003366",
              fontSize: 28,
              fontWeight: "ultralight",
              marginBottom: 2,
            }}
          >
            Welcome{"\n"}to
          </Text>
          <Text style={{ color: "#003366", fontSize: 28, fontWeight: "900" }}>
            CareConnect
          </Text>
          <LinearGradient
            colors={["rgba(0, 51, 102, 0.4)", "rgba(0, 191, 165, 0.4)"]}
            style={styles.stepsScroll}
          >
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 15,
                paddingHorizontal: 10,
                paddingVertical: 12,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  marginBottom: 5,
                  fontSize: 13,
                  fontWeight: "thin",
                  color: "#003366",
                }}
              >
                Email address
              </Text>
              <CustomInput
                id="email"
                value={formState.inputValues.email}
                placeholderTextColor="gray"
                placeholder="user@gmail.com"
                errorText={formState.inputValidities.email}
                onInputChanged={inputChangedHandler}
              />
            </View>
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 15,
                paddingHorizontal: 10,
                paddingVertical: 12,
                marginBottom: 5,
              }}
            >
              <Text
                style={{
                  marginBottom: 5,
                  fontSize: 13,
                  fontWeight: "thin",
                  color: "#003366",
                }}
              >
                Password
              </Text>

              <CustomInput
                id="password"
                value={formState.inputValues.password}
                placeholder="*******"
                placeholderTextColor="gray"
                errorText={formState.inputValidities.password}
                onInputChanged={inputChangedHandler}
              />
            </View>

            <CustomButton
              title="Login"
              onPress={authHandler}
              isLoading={isLoading}
              style={{
                marginHorizontal: 5,
                marginVertical: 10,
                backgroundColor: "#003366",
              }}
            />
            <View style={styles.bottomContainer}>
              <TouchableOpacity onPress={() => navigation.navigate("About Service")}>
                <Text
                  style={{ fontSize: 14, fontWeight: "800", color: "black" }}
                >
                  {" "}
                  How to register ?
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={styles.row}>
            <View style={styles.line} />
            <Text style={styles.text}>Or login with</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.bottom}>
            <View style={styles.loginOption}>
              <AntDesign name="google" size={24} color="black" />
              <Text style={styles.text2}>Login with Google</Text>
            </View>
            <View style={styles.loginOption}>
              <AntDesign name="facebook-square" size={24} color="black" />
              <Text style={styles.text2}>Login with Facebook</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("About Service")}>
            <Text style={[styles.text1, { marginTop: 20 }]}>
              Wanna try our services? here you are
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  stepsScroll: {
    backgroundColor: "rgba(241, 241, 241, 0.3)",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginVertical: 22,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  line: {
    height: 1,
    width: "20%",
    backgroundColor: "#000",
    marginHorizontal: 5,
  },
  text: {
    fontSize: 15,
    textAlign: "center",
    flexShrink: 1,
    marginHorizontal: 10,
  },
  text1: {
    fontSize: 12,
    textAlign: "center",
    marginHorizontal: 10,
  },
  bottom: {
    alignItems: "center",
  },
  loginOption: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 10,
    width: "100%",
    borderRadius: 10,
    marginBottom: 15,
  },
  text2: {
    fontSize: 16,
    color: "#000",
    marginHorizontal: 10,
  },
});
