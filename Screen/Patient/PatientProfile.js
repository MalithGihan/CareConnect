import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { logout } from "../../utils/actions/authActions";
import { useSelector, useDispatch } from "react-redux";
import CustomButton from "../Login/CustomButton";

export default PatientProfile = ({ navigation }) => {
  const dispatch = useDispatch(); 
  const userData = useSelector((state) => state.auth.userData);
  const token = useSelector((state) => state.auth.token);

  const handleLogout = async () => {
    try {
      await logout(dispatch, navigation);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome {userData && userData.fullName ? userData.fullName : 'User'}</Text>

        {userData ? (
          <View style={styles.info}>
            <Text style={styles.text1}>{userData.fullName}</Text>
            <Text style={styles.text}>User Role: {userData.role}</Text>
            <Text style={styles.text}>Email: {userData.email}</Text>
          </View>
        ) : (
          <Text style={styles.text}>No user data available</Text>
        )}
        <CustomButton
          title="Sign Out"
          onPress={handleLogout}
          style={{ marginVertical: 8 ,marginHorizontal: 20}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 30,
  },
  text1: {
    fontSize: 21,
    marginVertical: 8,
    fontWeight: "bold",
  },
  text: {
    fontSize: 15,
    marginVertical: 8,
    fontWeight: "500",
  },
  info: {
    flexDirection: "colum",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 15,
  }
});
