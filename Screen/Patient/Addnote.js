import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity,Alert } from 'react-native';
import { addUserNote } from '../../utils/actions/userActions';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "@expo/vector-icons/Ionicons";
import CommonNavBtn from '../../Components/CommonNavBtn';

export default function Addnote({ route }) {
  const [noteText, setNoteText] = useState('');
  const navigation = useNavigation();
  const { userId, selectedDate } = route.params;
  

  const handleAddNote = async () => {
    if (noteText.trim() !== '') {
      try {
        await addUserNote(userId, selectedDate, noteText);
        Alert.alert("Success", "Note added successfully");
        navigation.goBack();
      } catch (error) {
        console.error("Error adding note:", error);
        Alert.alert("Error", "Failed to add note. Please try again.");
      }
    } else {
      Alert.alert("Error", "Please enter a note before submitting.");
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          marginBottom:20
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Clinic Shedules")}>
          <Ionicons name="arrow-back-circle" size={40} color="#003366" />
        </TouchableOpacity>
        <Text
          style={{ fontSize: 20, marginLeft: 15, color: "#003366", flex: 1, fontWeight:'900' }}
          numberOfLines={1}
        >
          Add Note
        </Text>
      </View>

      <Text style={styles.section}>Add Note for {selectedDate}</Text>

      <TextInput
        style={styles.input}
        onChangeText={setNoteText}
        value={noteText}
        placeholder="Enter your note"
        multiline
      />
     
      <CommonNavBtn
              onPress={handleAddNote}
              title="Add note"
              style={{ backgroundColor: "#003366" }}
            />
    </View>
  );
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
        backgroundColor: "#D9E4EC",
        width: "100%",
        padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    fontSize: 15,
    fontWeight: "900",
    color: "#003366",
    marginBottom: 20,
  },
  input: {
    height: 350,
    borderRadius: 20,
    backgroundColor:'white',
    padding: 15,
    marginBottom: 20,
    textAlignVertical: 'top',
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
