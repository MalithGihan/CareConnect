import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { fetchPatientAppointments, fetchDoctorPrescriptions, handleAddNote, fetchPatientDetails } from '../../utils/actions/userActions';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const PatientAppointmentDetails = ({ route }) => {
    const { patientId, date, time, venue } = route.params;
    const [prescriptions, setPrescriptions] = useState([]);
    const [appointmentKey, setAppointmentKey] = useState(null);
    const [patientDetails, setPatientDetails] = useState({
        username: '',
        dateOfBirth: '',
        address: ''
    });
    const navigation = useNavigation();

    useEffect(() => {
        const loadPatientDetails = async () => {
            const details = await fetchPatientDetails(patientId);
            setPatientDetails(details);
        };

        loadPatientDetails();
    }, [patientId]);

    useFocusEffect(
        React.useCallback(() => {
            const loadPatientAppointments = async () => {
                const key = await fetchPatientAppointments(patientId, date, setAppointmentKey, setPrescriptions);
                if (key) {
                    await fetchDoctorPrescriptions(patientId, key, setPrescriptions);
                }
            };

            loadPatientAppointments();
        }, [patientId, date])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Appointment Details</Text>
            <Text>Patient ID: {patientId}</Text>
            <Text>Username: {patientDetails.username}</Text>
            <Text>Date of Birth: {patientDetails.dateOfBirth}</Text>
            <Text>Address: {patientDetails.address}</Text>
            <Text>Date: {date}</Text>
            <Text>Time: {time}</Text>
            <Text>Venue: {venue}</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('AddNoteScreen', { patientId, appointmentKey })}
            >
                <Text style={styles.buttonText}>ADD</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Prescription', { prescriptions, patientId, appointmentKey })}
            >
                <Text style={styles.buttonText}>EDIT</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('DeleteNoteScreen', { prescriptions, patientId, appointmentKey })}
            >
                <Text style={styles.buttonText}>DELETE</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('ViewMedicalHistoryScreen', { patientId })}
            >
                <Text style={styles.buttonText}>ALLVIEW</Text>
            </TouchableOpacity>
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
    button: {
        marginTop: 20,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default PatientAppointmentDetails;
