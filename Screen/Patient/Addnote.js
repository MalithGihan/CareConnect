import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { addUserNote } from '../../utils/actions/userActions';
import { useNavigation } from '@react-navigation/native';

export default function Addnote({ route }) {
  const [noteText, setNoteText] = useState('');
  const navigation = useNavigation();
  const { userId, selectedDate } = route.params;
  

  const handleAddNote = async () => {
    if (noteText.trim() !== '') {
      try {
        await addUserNote(userId, selectedDate, noteText);
        navigation.goBack();
      } catch (error) {
        console.error("Error adding note:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Note for {selectedDate}</Text>
      <TextInput
        style={styles.input}
        onChangeText={setNoteText}
        value={noteText}
        placeholder="Enter your note"
        multiline
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddNote}>
        <Text style={styles.buttonText}>Add Note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
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