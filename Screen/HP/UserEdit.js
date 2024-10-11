import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { saveUser } from "../../utils/actions/userActions";
import Ionicons from "@expo/vector-icons/Ionicons";
import CommonNavBtn from "../../Components/CommonNavBtn";

const UserEdit = () => {
  const route = useRoute();
  const { user } = route.params || {};
  const navigation = useNavigation();
  const [username, setuserName] = useState(user ? user.username : "");
  const [name, setName] = useState(user ? user.name : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [phoneNumber, setPhonenumber] = useState(user ? user.phoneNumber : "");
  const [address, setAddress] = useState(user ? user.address : "");
  const [dob, setdob] = useState(user ? user.dateOfBirth : "");

  const handleSave = async () => {
    try {
      await saveUser(user, username, email, phoneNumber, address);
      navigation.goBack();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  useEffect(() => {
    if (user) {
      console.log("Editing user:", user);
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("RoleBasedUsers")}>
          <Ionicons name="arrow-back-circle" size={40} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.titleText} numberOfLines={1}>
          {user ? "Edit User" : "Create User"}
        </Text>
      </View>

      <View style={{marginHorizontal:5}}>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        value={username}
        onChangeText={setuserName}
      />
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} placeholder="Enter Name" value={name} />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        value={phoneNumber}
        onChangeText={setPhonenumber}
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Address"
        value={address}
        onChangeText={setAddress}
      />
      <Text style={styles.label}>Date of Birth</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Date of Birth"
        value={dob}
      />

      <CommonNavBtn
        onPress={handleSave}
        title={user ? "Update User" : "Create User"}
        style={{ backgroundColor: "#003366" }}
      />
      </View>
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
  label: {
    fontSize: 15,
    marginBottom: 5,
    fontWeight: "900",
  },
  input: {
    marginVertical: 8,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
  },
  saveButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default UserEdit;
