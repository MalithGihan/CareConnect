import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  fetchPatientAppointments,
  fetchDoctorPrescriptions,
  handleAddNote,
  fetchPatientDetails,
} from "../../utils/actions/userActions";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import CommonNavBtn from "../../Components/CommonNavBtn";

const PatientAppointmentDetails = ({ route }) => {
  const { patientId, date, time, venue } = route.params;
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointmentKey, setAppointmentKey] = useState(null);
  const [patientDetails, setPatientDetails] = useState({
    username: "",
    dateOfBirth: "",
    address: "",
  });
  const navigation = useNavigation();

  useEffect(() => {
    const loadPatientDetails = async () => {
      const details = await fetchPatientDetails(patientId);
      setPatientDetails(details);
    };

    loadPatientDetails();
  }, [patientId]);

  useFocusEffect(
    React.useCallback(() => {
      const loadPatientAppointments = async () => {
        const key = await fetchPatientAppointments(
          patientId,
          date,
          setAppointmentKey,
          setPrescriptions
        );
        if (key) {
          await fetchDoctorPrescriptions(patientId, key, setPrescriptions);
        }
      };

      loadPatientAppointments();
    }, [patientId, date])
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          marginBottom: 15,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Search Patient")}>
          <Ionicons name="arrow-back-circle" size={40} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.titleText} numberOfLines={1}>
          Appointment Details
        </Text>
      </View>

      <View style={{ paddingLeft: 20, marginVertical: 15 }}>
        <Text style={styles.section}>Patient ID: {patientId}</Text>
        <Text style={styles.section}>Username: {patientDetails.username}</Text>
        <Text style={styles.section}>
          Date of Birth: {patientDetails.dateOfBirth}
        </Text>
        <Text style={styles.section}>Address: {patientDetails.address}</Text>
        <Text style={styles.section}>Date: {date}</Text>
        <Text style={styles.section}>Time: {time}</Text>
        <Text style={styles.section}>Venue: {venue}</Text>
      </View>

      <CommonNavBtn
        onPress={() =>
          navigation.navigate("AddNoteScreen", { patientId, appointmentKey })
        }
        title="Add"
        style={{ backgroundColor: "#003366" }}
      />

      <CommonNavBtn
        onPress={() =>
          navigation.navigate("Prescription", {
            prescriptions,
            patientId,
            appointmentKey,
          })
        }
        title="Update"
        style={{ backgroundColor: "#003366" }}
      />

      <CommonNavBtn
        onPress={() =>
          navigation.navigate("DeleteNoteScreen", {
            prescriptions,
            patientId,
            appointmentKey,
          })
        }
        title="Delete"
        style={{ backgroundColor: "#003366" }}
      />

      <CommonNavBtn
        onPress={() =>
          navigation.navigate("DeleteNoteScreen", {
            prescriptions,
            patientId,
            appointmentKey,
          })
        }
        title="All View"
        style={{ backgroundColor: "#003366" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E4EC",
    width: "100%",
    padding: 15,
  },
  rightCorner: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
  notificationIcon: {
    position: "relative",
    padding: 5,
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginBottom: 35,
  },
  titleText: {
    fontSize: 20,
    color: "#003366",
    flex: 1,
    fontWeight: "900",
    marginLeft: 10,
  },
  section: {
    fontSize: 15,
    fontWeight: "900",
    color: "#003366",
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PatientAppointmentDetails;
