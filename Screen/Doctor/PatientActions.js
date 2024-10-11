import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CommonNavBtn from "../../Components/CommonNavBtn";
import { LinearGradient } from "expo-linear-gradient";

const PatientActions = ({ route }) => {
  const navigation = useNavigation();
  const { patient } = route.params || {};

  if (!patient) {
    return (
      <View style={styles.container}>
        <Text style={styles.patientName}>
          No patient information available.
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SearchPatients")}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("SearchPatients")}>
          <Ionicons name="arrow-back-circle" size={40} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.titleText} numberOfLines={1}>
          Patient Information
        </Text>
      </View>

      <LinearGradient
        colors={["rgba(0, 51, 102, 0.3)", "rgba(0, 191, 165, 0.3)"]}
        style={styles.info}
      >
        <View style={{ flexDirection: "row", gap: 20, marginBottom: 15 }}>
          <View style={{ flexDirection: "column" }}>
            <FontAwesome name="user-circle-o" size={80} color="#003366" />
            <Text style={{ fontSize: 10, marginTop: 10 }}>
              Hospital :{patient.userName}
            </Text>
          </View>
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.title}>{patient.name}</Text>
            <Text style={styles.sub}>NIC : {patient.nic}</Text>
            <Text style={styles.sub}>
              Date of Birth : {patient.dateOfBrirth}
            </Text>
            <Text style={styles.sub}>Gender : {patient.gender}</Text>
          </View>
        </View>

        <Text style={styles.section}>Actions</Text>

        <CommonNavBtn
          onPress={() => navigation.navigate("Addmedical", { patient })}
          title="Add Medical"
          style={{ backgroundColor: "#003366" }}
        />

        <CommonNavBtn
          onPress={() => navigation.navigate("UpdateRecord", { patient })}
          title="Update Medical"
          style={{ backgroundColor: "#003366" }}
        />

        <CommonNavBtn
          onPress={() => navigation.navigate("DeleteRecord", { patient })}
          title="Delete Medical"
          style={{ backgroundColor: "#003366" }}
        />

        <CommonNavBtn
          onPress={() => navigation.navigate("ViewAllRecords", { patient })}
          title="View Medical History"
          style={{ backgroundColor: "#003366" }}
        />
      </LinearGradient>
    </View>
  );
};

export default PatientActions;

const styles = StyleSheet.create({
  container: {
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
    color: "#003366",
    flex: 1,
    fontWeight: "900",
    marginLeft: 10,
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
    marginVertical: 20,
  },
});
