import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useCallback, useReducer, useState, useEffect } from "react";
import CustomInput from "../Login/CustomInput";
import CustomButton from "../Login/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { reducer } from "../../utils/reducers/formReducers";
import { validateInput } from "../../utils/actions/formActions";
import { useDispatch } from "react-redux";
import { signUp } from "../../utils/actions/authActions";
import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

const isTestMode = true;

const initialState = {
  inputValues: {
    userName: "",
    email: "",
    password: "",
    role: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    nic: "",
    dateOfBrirth: "",
    education: "",
    hospital: "",
    jobStart: "",
  },
  inputValidities: {
    userName: false,
    email: false,
    password: false,
    role: false,
    fullName: false,
    phoneNumber: false,
    address: false,
    nic: false,
    dateOfBrirth: false,
    education: false,
    hospital: false,
    jobStart: false,
  },
  formIsValid: false,
};

export default UserCreate = () => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("patient");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

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
      const action = signUp(
        formState.inputValues.userName,
        formState.inputValues.email,
        formState.inputValues.password,
        role,
        formState.inputValues.fullName,
        formState.inputValues.phoneNumber,
        formState.inputValues.address,
        formState.inputValues.nic,
        formState.inputValues.dateOfBrirth,
        formState.inputValues.education,
        formState.inputValues.hospital,
        formState.inputValues.jobStart
      );

      await dispatch(action);
      setError(null);
      Alert.alert("Account Successfully created", "Account created");
      setIsLoading(false);
      navigation.navigate("Sign In");
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
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("RoleBasedUsers")}>
          <Ionicons name="arrow-back-circle" size={40} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.titleText} numberOfLines={1}>
          Register New User
        </Text>
      </View>

      <DropDownPicker
        open={open}
        value={role}
        items={[
          { label: "Patient", value: "patient" },
          { label: "Doctor", value: "doctor" },
          { label: "Health Provider", value: "healthProvider" },
        ]}
        setOpen={setOpen}
        setValue={setRole}
        placeholder="Select Role"
        containerStyle={{ marginVertical: 10, zIndex: 1 }}
      />

      <ScrollView nestedScrollEnabled={true} style={{ marginBottom: 100 }}>
        <View style={styles.main}>
          <Text style={styles.label}>Enter User information as following</Text>

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
              User Name
            </Text>

            <CustomInput
              id="userName"
              value={formState.inputValues.userName}
              placeholder="Type Here"
              placeholderTextColor="gray"
              errorText={formState.inputValidities.userName}
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
              Email Address
            </Text>

            <CustomInput
              id="email"
              value={formState.inputValues.email}
              placeholder="Type Here"
              placeholderTextColor="gray"
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
              placeholder="Type Here"
              placeholderTextColor="gray"
              errorText={formState.inputValidities.password}
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
              Full Name
            </Text>

            <CustomInput
              id="fullName"
              value={formState.inputValues.fullName}
              placeholder="Type Here"
              placeholderTextColor="gray"
              errorText={formState.inputValidities.fullName}
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
              Phone Number
            </Text>

            <CustomInput
              id="phoneNumber"
              value={formState.inputValues.phoneNumber}
              placeholder="Type Here"
              placeholderTextColor="gray"
              errorText={formState.inputValidities.phoneNumber}
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
              Address
            </Text>
            <CustomInput
              id="address"
              value={formState.inputValues.address}
              placeholder="Type Here"
              placeholderTextColor="gray"
              errorText={formState.inputValidities.address}
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
              NIC Number
            </Text>

            <CustomInput
              id="nic"
              value={formState.inputValues.nic}
              placeholder="Type Here"
              placeholderTextColor="gray"
              errorText={formState.inputValidities.nic}
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
              Date Of Birth Day
            </Text>

            <CustomInput
              id="dateOfBrirth"
              value={formState.inputValues.dateOfBrirth}
              placeholder="Type Here"
              placeholderTextColor="gray"
              errorText={formState.inputValidities.dateOfBrirth}
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
              Hospital
            </Text>

            <CustomInput
                id="hospital"
                value={formState.inputValues.hospital}
                placeholder="Type Here"
                placeholderTextColor="gray"
                errorText={formState.inputValidities.hospital}
                onInputChanged={inputChangedHandler}
              />
          </View>

          {role === "doctor" && (
            <>
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
                  Education
                </Text>

                <CustomInput
                  id="education"
                  value={formState.inputValues.education}
                  placeholder="Type Here"
                  placeholderTextColor="gray"
                  errorText={formState.inputValidities.education}
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
                  Hospital
                </Text>

                <CustomInput
                  id="hospital"
                  value={formState.inputValues.hospital}
                  placeholder="Type Here"
                  placeholderTextColor="gray"
                  errorText={formState.inputValidities.hospital}
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
                  Job Started Date
                </Text>

                <CustomInput
                  id="jobStart"
                  value={formState.inputValues.jobStart}
                  placeholder="Type Here"
                  placeholderTextColor="gray"
                  errorText={formState.inputValidities.jobStart}
                  onInputChanged={inputChangedHandler}
                />
              </View>
            </>
          )}

          <CustomButton
            title="Register"
            onPress={authHandler}
            isLoading={isLoading}
            style={{ marginVertical: 8, backgroundColor: "#003366" }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E4EC",
    padding: 15,
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginBottom: 25,
  },
  titleText: {
    fontSize: 20,
    color: "#003366",
    flex: 1,
    fontWeight: "900",
    marginLeft: 10,
  },
  main: {
    marginVertical: 22,
    backgroundColor: "white",
    padding: 10,
    margin: 5,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#003366",
    marginVertical: 10,
  },
});
