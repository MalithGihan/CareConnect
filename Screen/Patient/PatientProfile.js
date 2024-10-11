import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { logout } from "../../utils/actions/authActions";
import { useSelector, useDispatch } from "react-redux";
import CommonNavBtn from "../../Components/CommonNavBtn";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView } from "react-native-gesture-handler";
import FontAwesome from "@expo/vector-icons/FontAwesome";

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
    <View
      style={{
        flex: 1,
        backgroundColor: "#D9E4EC",
        width: "100%",
        padding: 15,
      }}
    >
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            marginBottom: 25,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("Dashbord")}>
            <Ionicons name="arrow-back-circle" size={40} color="#003366" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              marginLeft: 15,
              color: "#003366",
              flex: 1,
              fontWeight: "900",
            }}
            numberOfLines={1}
          >
            Profile Management
          </Text>
          <View style={styles.rightCorner}>
            <CommonNavBtn
              onPress={handleLogout}
              title="Sign Out"
              style={{ backgroundColor: "#003366" }}
            />
          </View>
        </View>

        <ScrollView >
          {userData ? (
            <View>
            <View style={styles.info}>
              <View style={{ flexDirection: "row", gap: 20, marginBottom: 15 }}>
                <FontAwesome name="user-circle-o" size={80} color="#003366" />
                <View>
                  <Text style={styles.title}>{userData.userName}</Text>
                  <Text style={styles.sub}>Hospital : {userData.hospital}</Text>
                </View>
              </View>

              <Text style={styles.section}>Personal Information</Text>

              <View style={{marginLeft:10}}>
                <View style={styles.ud}>
                  <Text style={styles.labal}>Full Name</Text>
                  <Text style={styles.text}>{userData.fullName}</Text>
                </View>
                <View style={styles.ud}>
                  <Text style={styles.labal}>NIC</Text>
                  <Text style={styles.text}>{userData.nic}</Text>
                </View>
                <View style={styles.ud}>
                  <Text style={styles.labal}>Date of Birth</Text>
                  <Text style={styles.text}>{userData.dateOfBirth}</Text>
                </View>
                <View style={styles.ud}>
                  <Text style={styles.labal}>Gender</Text>
                  <Text style={styles.text}>{userData.gender}</Text>
                </View>
              </View>  
            </View>

            <View style={styles.info}>
              <Text style={styles.section}>Contact Information</Text>

              <View style={{marginLeft:10}}>
                <View style={styles.ud}>
                  <Text style={styles.labal}>Phone Number</Text>
                  <Text style={styles.text}>{userData.phoneNumber}</Text>
                </View>
                <View style={styles.ud}>
                  <Text style={styles.labal}>Email</Text>
                  <Text style={styles.text}>{userData.email}</Text>
                </View>
                <View style={styles.ud}>
                  <Text style={styles.labal}>Address</Text>
                  <Text style={styles.text}>{userData.address}</Text>
                </View>
              </View>  
            </View>


            <View style={styles.info}>
              <Text style={styles.section}>Emergency Contact Information</Text>

              <View style={{marginLeft:10}}>
                <View style={styles.ud}>
                  <Text style={styles.labal}>Emergency Contact Name</Text>
                  <Text style={styles.text}>{userData.phoneNumber}</Text>
                </View>
                <View style={styles.ud}>
                  <Text style={styles.labal}>Emergency Contact Phone Number</Text>
                  <Text style={styles.text}>{userData.email}</Text>
                </View>
                <View style={styles.ud}>
                  <Text style={styles.labal}>Relationship to Emergency Contact</Text>
                  <Text style={styles.text}>{userData.address}</Text>
                </View>
              </View>  
            </View>

            
            <View style={[styles.info,{marginBottom:100}]}>
              <Text style={styles.section}>Medical Information</Text>

              <View style={{marginLeft:10}}>
                <View style={styles.ud}>
                  <Text style={styles.labal}>Blood Type</Text>
                  <Text style={styles.text}>{userData.phoneNumber}</Text>
                </View>
                <View style={styles.ud}>
                  <Text style={styles.labal}>Allergies</Text>
                  <Text style={styles.text}>{userData.email}</Text>
                </View>
                <View style={styles.ud}>
                  <Text style={styles.labal}>Chronic Conditions</Text>
                  <Text style={styles.text}>{userData.address}</Text>
                </View>
                <View style={styles.ud}>
                  <Text style={styles.labal}>Chronic Conditions</Text>
                  <Text style={styles.text}>{userData.address}</Text>
                </View>
                <View style={styles.ud}>
                  <Text style={styles.labal}>Primary Care Physician</Text>
                  <Text style={styles.text}>{userData.address}</Text>
                </View>
              </View>  
            </View>


            </View>
          ) : (
            <Text style={styles.text}>No user data available</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rightCorner: {
    position: "absolute",
    top: -15,
    right: 0,
    zIndex: 1,
  },
  info: {
    flexDirection: "colum",
    justifyContent: "flex-start",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "left",
  },
  sub: {
    fontSize: 11,
    marginVertical: 4,
    fontWeight: "300",
  },
  section: {
    fontSize: 15,
    fontWeight: "900",
    color: "#003366",
    marginBottom: 20,
  },
  ud: {
    marginBottom: 15,
  },
  labal: {
    fontSize: 12,
    fontWeight: "300",
    color: "#003366",
  },
  text: {
    fontSize: 17,
    marginBottom: 4,
    fontWeight: '800',
    color: "#003366",
  },
});
