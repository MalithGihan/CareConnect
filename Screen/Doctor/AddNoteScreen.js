import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { handleAddNote } from '../../utils/actions/userActions';

const AddNoteScreen = ({ route, navigation }) => {
    const { patientId, appointmentKey } = route.params;

    const [prescriptions, setPrescriptions] = useState([]);
    const [note, setNote] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [medications, setMedications] = useState('');

    const addNote = async () => {
        await handleAddNote(patientId, appointmentKey, note, diagnosis, medications, setPrescriptions);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add New Note</Text>
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
            <Button title="Add Note" onPress={addNote} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
    },
});

export default AddNoteScreen;
