import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import { fetchPatientAppointments, fetchDoctorPrescription, handleAddNote } from '../../utils/actions/userActions';

const PatientAppointmentDetails = ({ route }) => {
    const { patientId, date, time, venue } = route.params;
    const [note, setNote] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [medications, setMedications] = useState('');
    const [prescriptions, setPrescriptions] = useState([]);
    const [appointmentKey, setAppointmentKey] = useState(null);

    useEffect(() => {
        const loadPatientAppointments = async () => {
            const key = await fetchPatientAppointments(patientId, date, setAppointmentKey, setPrescriptions);
            if (key) {
                await fetchDoctorPrescription(patientId, key, setPrescriptions);
            }
        };

        loadPatientAppointments();
    }, [date, patientId]);

    const handleAddPrescription = async () => {
        await handleAddNote(patientId, appointmentKey, note, diagnosis, medications, setPrescriptions);
        setNote('');
        setDiagnosis('');
        setMedications('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Appointment Details</Text>
            <Text>Patient ID: {patientId}</Text>
            <Text>Date: {date}</Text>
            <Text>Time: {time}</Text>
            <Text>Venue: {venue}</Text>

            <TextInput
                style={styles.input}
                placeholder="Add a prescription for this appointment"
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
            <Button title="Add Prescription" onPress={handleAddPrescription} />

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
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
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

export default PatientAppointmentDetails;
