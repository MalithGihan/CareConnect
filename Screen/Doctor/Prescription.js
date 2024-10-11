import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  fetchPrescriptions,
  savePrescription,
} from "../../utils/actions/userActions";
import Ionicons from "@expo/vector-icons/Ionicons";
import CommonNavBtn from "../../Components/CommonNavBtn";
import { useNavigation } from "@react-navigation/native";

const Prescription = ({ route }) => {
  const { patientId, appointmentKey } = route.params;
  const [prescriptions, setPrescriptions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [updatedNote, setUpdatedNote] = useState("");
  const [updatedDiagnosis, setUpdatedDiagnosis] = useState("");
  const [updatedMedications, setUpdatedMedications] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = fetchPrescriptions(
      patientId,
      appointmentKey,
      setPrescriptions
    );

    return unsubscribe;
  }, [patientId, appointmentKey]);

  const handleEdit = (index, prescription) => {
    setEditingIndex(index);
    setUpdatedNote(prescription.note);
    setUpdatedDiagnosis(prescription.diagnosis);
    setUpdatedMedications(prescription.medications);
  };

  const handleSave = async (prescriptionId) => {
    try {
      await savePrescription(patientId, appointmentKey, prescriptionId, {
        note: updatedNote,
        diagnosis: updatedDiagnosis,
        medications: updatedMedications,
      });
      setEditingIndex(null);
    } catch (error) {
      console.error("Failed to save prescription", error);
    }
  };

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
          Prescriptions
        </Text>
      </View>

      {prescriptions.length > 0 ? (
        <FlatList
          data={prescriptions}
          renderItem={({ item, index }) => (
            <View style={styles.noteItem}>
              {editingIndex === index ? (
                <View>
                  <TextInput
                    style={styles.input}
                    value={updatedNote}
                    onChangeText={setUpdatedNote}
                    placeholder="Edit Note"
                  />
                  <TextInput
                    style={styles.input}
                    value={updatedDiagnosis}
                    onChangeText={setUpdatedDiagnosis}
                    placeholder="Edit Diagnosis"
                  />
                  <TextInput
                    style={styles.input}
                    value={updatedMedications}
                    onChangeText={setUpdatedMedications}
                    placeholder="Edit Medications"
                  />
                  <Button
                    title="Save"
                    onPress={() => handleSave(item.prescriptionId)}
                  />
                  <Button
                    title="Cancel"
                    color="red"
                    onPress={() => setEditingIndex(null)}
                  />
                </View>
              ) : (
                <View style={styles.recordItem}>
                  <Text style={styles.recordText}>Note: {item.note}</Text>
                  <Text style={styles.recordText}>Diagnosis: {item.diagnosis}</Text>
                  <Text style={styles.recordText}>Medications: {item.medications}</Text>
                  <Text>
                    Added on: {new Date(item.createdAt).toLocaleString()}
                  </Text>

                  <CommonNavBtn
                    onPress={() => handleEdit(index, item)}
                    title="Edit"
                    style={{ backgroundColor: "#003366" }}
                  />
                </View>
              )}
            </View>
          )}
          keyExtractor={(item) => item.prescriptionId}
        />
      ) : (
        <Text>No prescriptions added yet.</Text>
      )}
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
  titleText: {
    fontSize: 20,
    color: "#003366",
    flex: 1,
    fontWeight: "900",
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  noteItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  recordItem: {
    flexDirection: "col",
    justifyContent: "flex-start",
    padding: 20,
    marginHorizontal: 5,
    backgroundColor: "white",
    borderRadius: 30,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  recordList: { paddingBottom: 20 },
  recordText: { fontSize: 14, marginBottom: 5, fontWeight: "600", marginBottom: 8},
  noRecordsText: { textAlign: "center", marginTop: 20, fontSize: 16 },
});

export default Prescription;
