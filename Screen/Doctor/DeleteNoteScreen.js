import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, StyleSheet, Alert,TouchableOpacity } from "react-native";
import {
  getallPrescriptions,
  deletePrescription,
} from "../../utils/actions/userActions";
import Ionicons from "@expo/vector-icons/Ionicons";
import CommonNavBtn from "../../Components/CommonNavBtn";
import { useNavigation } from "@react-navigation/native";

const DeleteNoteScreen = ({ route }) => {
  const { patientId, appointmentKey } = route.params;
  const [prescriptions, setPrescriptions] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = getallPrescriptions(
      patientId,
      appointmentKey,
      setPrescriptions
    );

    return () => unsubscribe();
  }, [patientId, appointmentKey]);

  const handleDeletePrescription = async (prescriptionId) => {
    const result = await deletePrescription(
      patientId,
      appointmentKey,
      prescriptionId
    );
    if (result.success) {
      Alert.alert("Success", "Prescription deleted successfully!");
    } else {
      Alert.alert("Error", "Failed to delete the prescription.");
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

      <Text style={styles.subtitle}>Prescriptions:</Text>
      {prescriptions.length > 0 ? (
        <FlatList
          data={prescriptions}
          renderItem={({ item }) => (
            <View style={styles.noteItem}>
              <Text>Note: {item.note}</Text>
              <Text>Diagnosis: {item.diagnosis}</Text>
              <Text>Medications: {item.medications}</Text>
              <Text>Added on: {new Date(item.createdAt).toLocaleString()}</Text>
              <Button
                title="Delete"
                onPress={() => {
                  Alert.alert(
                    "Delete Confirmation",
                    "Are you sure you want to delete this prescription?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        onPress: () =>
                          handleDeletePrescription(item.prescriptionId),
                      },
                    ]
                  );
                }}
              />
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

export default DeleteNoteScreen;
