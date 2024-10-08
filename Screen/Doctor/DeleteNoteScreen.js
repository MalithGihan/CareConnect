import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { getallPrescriptions, deletePrescription } from '../../utils/actions/userActions';

const DeleteNoteScreen = ({ route }) => {
    const { patientId, appointmentKey } = route.params;
    const [prescriptions, setPrescriptions] = useState([]);

    useEffect(() => {
        const unsubscribe = getallPrescriptions(patientId, appointmentKey, setPrescriptions);

        return () => unsubscribe();
    }, [patientId, appointmentKey]);

    const handleDeletePrescription = async (prescriptionId) => {
        const result = await deletePrescription(patientId, appointmentKey, prescriptionId);
        if (result.success) {
            Alert.alert("Success", "Prescription deleted successfully!");
        } else {
            Alert.alert("Error", "Failed to delete the prescription.");
        }
    };

    return (
        <View>
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
                            <Button title="Delete" onPress={() => {
                                Alert.alert(
                                    "Delete Confirmation",
                                    "Are you sure you want to delete this prescription?",
                                    [
                                        { text: "Cancel", style: "cancel" },
                                        { text: "Delete", onPress: () => handleDeletePrescription(item.prescriptionId) },
                                    ]
                                );
                            }} />
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
});

export default DeleteNoteScreen;
