import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import {
  addMedicalReport,
  updateMedicalReport,
} from "../../utils/actions/reportAction";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

const AddRecord = ({ route, navigation }) => {
  const { patient, initialValues } = route.params;
  const [diagnosis, setDiagnosis] = useState(
    initialValues ? initialValues.diagnosis : ""
  );
  const [medications, setMedications] = useState(
    initialValues ? initialValues.medications : ""
  );
  const [treatment, setTreatment] = useState(
    initialValues ? initialValues.treatment : ""
  );
  const [notes, setNotes] = useState(initialValues ? initialValues.notes : "");

  const handleAddOrUpdateReport = async () => {
    if (diagnosis.trim() === "") {
      Alert.alert("Please enter a diagnosis");
      return;
    }

    const report = {
      diagnosis,
      medications,
      treatment,
      notes,
      date: new Date().toISOString(),
    };

    try {
      if (initialValues) {
        
        await updateMedicalReport(patient.id, initialValues.id, report);
        Alert.alert("Report updated successfully");
      } else {
        await addMedicalReport(patient.id, report);
        Alert.alert("Report added successfully");
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error adding/updating report:", error);
      Alert.alert("Error adding/updating report");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("PatientActions", { patient })} 
        >
          <Ionicons name="arrow-back-circle" size={40} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.titleText} numberOfLines={1}>
          Add Medical Record
        </Text>
        <View style={styles.rightCorner}>
          <Pressable
            onPress={() => navigation.navigate("SearchPatients")}
            style={styles.notificationIcon}
          >
            <Ionicons name="search" size={35} color="#003366" />
          </Pressable>
        </View>
      </View>

      <LinearGradient
        colors={["rgba(0, 51, 102, 0.3)", "rgba(0, 191, 165, 0.3)"]}
        style={styles.info}
      >

      <Text style={styles.label}>Diagnosis</Text>
      <TextInput
        style={styles.input}
        value={diagnosis}
        onChangeText={setDiagnosis}
        placeholder="Enter diagnosis"
      />

      <Text style={styles.label}>Medications</Text>
      <TextInput
        style={styles.input}
        value={medications}
        onChangeText={setMedications}
        placeholder="Enter medications"
      />

      <Text style={styles.label}>Treatment</Text>
      <TextInput
        style={styles.input}
        value={treatment}
        onChangeText={setTreatment}
        placeholder="Enter treatment"
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input,{height: 150,textAlignVertical: 'top',}]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Enter notes"
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleAddOrUpdateReport}>
      <Ionicons name="checkmark-done-circle-sharp" size={60} color="#003366" />
      </TouchableOpacity>

      </LinearGradient>
    </View>
  );
};

export default AddRecord;

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
  label: { 
    fontSize: 15, 
    marginBottom: 5,
    fontWeight:'900',
    marginTop:10 
  },
  input: {
    marginVertical:8,
    backgroundColor:'white',
    borderRadius: 5,
    padding: 10,
  },
  button: {
    alignSelf:'flex-end',
    zIndex: 1,
    marginTop:30
  },
});
