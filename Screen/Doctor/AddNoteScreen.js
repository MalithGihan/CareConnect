import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { handleAddNote } from "../../utils/actions/userActions";
import Ionicons from "@expo/vector-icons/Ionicons";
import CommonNavBtn from "../../Components/CommonNavBtn";

const AddNoteScreen = ({ route, navigation }) => {
  const { patientId, appointmentKey } = route.params;

  const [prescriptions, setPrescriptions] = useState([]);
  const [note, setNote] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medications, setMedications] = useState("");

  const addNote = async () => {
    await handleAddNote(
      patientId,
      appointmentKey,
      note,
      diagnosis,
      medications,
      setPrescriptions
    );
    navigation.goBack();
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
          Add Note
        </Text>
      </View>

      <Text style={styles.section}>Add New Note</Text>
      <TextInput
        style={styles.input}
        placeholder="Note"
        value={note}
        onChangeText={setNote}
      />
      <TextInput
        style={styles.input}
        placeholder="Diagnosis"
        value={diagnosis}
        onChangeText={setDiagnosis}
      />
      <TextInput
        style={styles.input}
        placeholder="Medications"
        value={medications}
        onChangeText={setMedications}
      />

      <CommonNavBtn
        onPress={addNote}
        title="Add Note"
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
  input: {
    marginVertical: 8,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
  },
});

export default AddNoteScreen;
