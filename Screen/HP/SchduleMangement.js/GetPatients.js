import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  getAllPatients,
  getUserClinicAppointments,
} from "../../../utils/actions/userActions";
import { CheckBox } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

export default function GetPatients({ navigate }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientList = await getAllPatients();
        const patientsWithAppointments = await Promise.all(
          patientList.map(async (patient) => {
            const appointments = await getUserClinicAppointments(patient.id);
            return { ...patient, clinicAppointments: appointments };
          })
        );
        setPatients(patientsWithAppointments);
      } catch (error) {
        console.error("Error fetching patients:", error);
        Alert.alert("Error", "Failed to fetch patients. Please try again.");
      }
    };
    fetchPatients();
  }, []);

  const togglePatientSelection = (id) => {
    setSelectedPatients((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSelectAll = () => {
    const allSelected =
      Object.keys(selectedPatients).length === patients.length &&
      Object.values(selectedPatients).every((v) => v);
    const newSelection = patients.reduce((acc, patient) => {
      acc[patient.id] = !allSelected;
      return acc;
    }, {});
    setSelectedPatients(newSelection);
  };

  const handleSelectClinicDate = () => {
    const selectedPatientIds = Object.keys(selectedPatients).filter(
      (id) => selectedPatients[id]
    );
    navigation.navigate("ClinicDateSelection", { selectedPatientIds });
  };

  const renderPatient = ({ item }) => (
    <View style={styles.patientItem}>
      <CheckBox
        checked={selectedPatients[item.id] || false}
        onPress={() => togglePatientSelection(item.id)}
      />
      <View style={styles.patientInfo}>
        <Text style={styles.patientEmail}>{item.email}</Text>
        <Text>Clinic Appointments:</Text>
        {item.clinicAppointments && item.clinicAppointments.length > 0 ? (
          item.clinicAppointments.map((appointment, index) => (
            <Text key={index}>
              {`${appointment.date} - Dr. ${appointment.doctor} at ${appointment.venue}, ${appointment.time}`}
            </Text>
          ))
        ) : (
          <Text>No clinic appointments set</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <CheckBox
        title="Select All"
        checked={
          Object.keys(selectedPatients).length === patients.length &&
          Object.values(selectedPatients).every((v) => v)
        }
        onPress={toggleSelectAll}
      />
      <TouchableOpacity
        onPress={handleSelectClinicDate}
        disabled={Object.values(selectedPatients).every((v) => !v)}
        style={styles.button}
      >
        <Text style={{ color: "white", fontWeight: "900", fontSize: 15 }}>
          Select Clinic Date
        </Text>
      </TouchableOpacity>
      <FlatList
        data={patients}
        renderItem={renderPatient}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#003366",
  },
  patientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "white",
    width: "95%",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  patientInfo: {
    flex: 1,
  },
  patientEmail: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#003366",
    paddingVertical: 8,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 15,
  },
});
