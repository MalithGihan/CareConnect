import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { fetchPrescriptions, savePrescription } from '../../utils/actions/userActions';

const Prescription = ({ route }) => {
    const { patientId, appointmentKey } = route.params;
    const [prescriptions, setPrescriptions] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [updatedNote, setUpdatedNote] = useState('');
    const [updatedDiagnosis, setUpdatedDiagnosis] = useState('');
    const [updatedMedications, setUpdatedMedications] = useState('');

    useEffect(() => {
        const unsubscribe = fetchPrescriptions(patientId, appointmentKey, setPrescriptions);

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
            console.error('Failed to save prescription', error);
        }
    };

    return (
        <View>
            <Text style={styles.subtitle}>Prescriptions:</Text>
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
                                    <Button title="Save" onPress={() => handleSave(item.prescriptionId)} />
                                    <Button title="Cancel" color="red" onPress={() => setEditingIndex(null)} />
                                </View>
                            ) : (
                                <View>
                                    <Text>Note: {item.note}</Text>
                                    <Text>Diagnosis: {item.diagnosis}</Text>
                                    <Text>Medications: {item.medications}</Text>
                                    <Text>Added on: {new Date(item.createdAt).toLocaleString()}</Text>
                                    <Button title="Edit" onPress={() => handleEdit(index, item)} />
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
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    noteItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    },
});

export default Prescription;
