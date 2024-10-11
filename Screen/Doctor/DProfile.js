import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { logout } from "../../utils/actions/authActions";
import { useSelector, useDispatch } from "react-redux";
import CommonNavBtn from "../../Components/CommonNavBtn";
import FontAwesome from "@expo/vector-icons/FontAwesome";


export default DProfile = ({ navigation }) => {
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

    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.titleText} numberOfLines={1}>
          Profile
        </Text>
        <View style={styles.rightCorner}>
          <CommonNavBtn
            onPress={handleLogout}
            title="Sign Out"
            style={styles.signOutButton}
          />
        </View>
      </View>

      {userData ? (
        <View style={styles.infoContainer}>
          <View style={styles.userInfoRow}>
            <FontAwesome name="user-circle-o" size={80} color="#003366" />
            <View style={styles.userInfoTextContainer}>
              <Text style={styles.userName}>{userData.userName}</Text>
              <Text style={styles.subText}>Hospital: {userData.hospital}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.personalInfoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.text}>{userData.fullName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>NIC</Text>
              <Text style={styles.text}>{userData.nic}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Phone Number</Text>
              <Text style={styles.text}>{userData.phoneNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email Address</Text>
              <Text style={styles.text}>{userData.email}</Text>
            </View>
          </View>
        </View>
      ) : (
        <Text style={styles.noUserDataText}>No user data available</Text>
      )}
    </View>

  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#D9E4EC",
    width: "100%",
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
    marginTop: 10,
    color: "#003366",
    flex: 1,
    fontWeight: "900",
  },
  rightCorner: {
    justifyContent: "flex-end",
  },
  signOutButton: {
    backgroundColor: "#003366",
  },
  infoContainer: {
    marginTop: 15,
    backgroundColor:'white',
    padding:15,
    borderRadius:20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 20,
  },
  userInfoTextContainer: {
    flexDirection: "column",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
  },
  subText: {
    fontSize: 14,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#003366",
  },
  personalInfoContainer: {
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: "col",
    justifyContent: "space-between",
    marginBottom: 20,
    gap:5
  },
  label: {
    fontSize: 14,
    color: "#333",
    fontWeight:'400'
  },
  text: {
    fontSize: 16,
    color: "#666",
    fontWeight:'900'
  },
  noUserDataText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});
