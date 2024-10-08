import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { fetchPatientAppointments, fetchDoctorPrescription } from '../../utils/actions/userActions';

const PatientNotesScreen = ({ navigation, route }) => {
    const { patientId } = route.params;
    const [prescriptions, setPrescriptions] = useState([]);
    const [appointmentKey, setAppointmentKey] = useState('');

    useEffect(() => {
        const loadPatientAppointments = async () => {
            const key = await fetchPatientAppointments(patientId, date, setAppointmentKey, setPrescriptions);
            if (key) {
                await fetchDoctorPrescription(patientId, key, setPrescriptions);
            }
        };

        loadPatientAppointments();
    }, [patientId, date]);

    const handleEditPrescription = (item) => {
        navigation.navigate('EditNoteScreen', {
            patientId: patientId,
            appointmentKey: appointmentKey,
            existingNote: item
        });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={prescriptions}
                renderItem={({ item }) => (
                    <View style={styles.noteItem}>
                        <Text>Note: {item.note}</Text>
                        <Text>Diagnosis: {item.diagnosis}</Text>
                        <Text>Medications: {item.medications}</Text>
                        <Text>Added on: {new Date(item.createdAt).toLocaleString()}</Text>
                        <Button title="Edit" onPress={() => handleEditPrescription(item)} />
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    noteItem: {
        marginBottom: 20,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
});

export default PatientNotesScreen;
