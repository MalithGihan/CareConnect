import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { fetchAppointments } from '../../utils/actions/userActions';

export default function MedicalHistoryView() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetchAppointments(setAppointments);
    };

    fetchData();
  }, []);

  const renderAppointmentItem = ({ item }) => (
    <View style={styles.appointmentItem}>
      <Text style={styles.dateText}>Date: {item.date}</Text>
      <Text style={styles.timeText}>Time: {item.time}</Text>
      <Text style={styles.doctorText}>Doctor: {item.doctor}</Text>
      {item.doctors_prescription && Object.entries(item.doctors_prescription).map(([key, prescription]) => (
        <View key={key} style={styles.prescriptionItem}>
          <Text style={styles.prescriptionDateText}>Prescription Date: {prescription.createdAt}</Text>
          <Text style={styles.diagnosisText}>Diagnosis: {prescription.diagnosis}</Text>
          <Text style={styles.medicationsText}>Medications: {prescription.medications}</Text>
          <Text style={styles.noteText}>Note: {prescription.note}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medical History - Clinic Appointments</Text>
      {appointments.length > 0 ? (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={renderAppointmentItem}
        />
      ) : (
        <Text>No appointments available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  appointmentItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0066cc',
  },
  timeText: {
    fontSize: 16,
    marginBottom: 4,
  },
  doctorText: {
    fontSize: 16,
    marginBottom: 8,
  },
  prescriptionItem: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    marginTop: 8,
    borderRadius: 6,
  },
  prescriptionDateText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  diagnosisText: {
    fontSize: 15,
    marginBottom: 4,
  },
  medicationsText: {
    fontSize: 15,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#555',
  },
});
