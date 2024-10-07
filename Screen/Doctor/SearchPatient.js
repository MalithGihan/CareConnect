import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button } from 'react-native';
import { getAuth } from 'firebase/auth';
import { fetchAppointmentsForToday, updateStatus } from '../../utils/actions/userActions';
import { useNavigation } from '@react-navigation/native';

const SearchPatient = () => {
  const [appointments, setAppointments] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userId = currentUser ? currentUser.uid : null;
  const navigation = useNavigation();

  useEffect(() => {
    const loadAppointments = async () => {
      await fetchAppointmentsForToday(setAppointments);
    };
    loadAppointments();
  }, [userId]);

  const handleAppointmentPress = (appointment) => {
    navigation.navigate('PatientAppointmentDetails', {
      patientId: appointment.id,
      date: appointment.date,
      time: appointment.time,
      venue: appointment.venue,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Appointments for today:</Text>
      {appointments.length > 0 ? (
        <FlatList
          data={appointments}
          renderItem={({ item }) => (
            <View style={[styles.appointmentItem, item.status ? styles.completed : styles.pending]}>
              <TouchableOpacity onPress={() => handleAppointmentPress(item)}>
                <Text>Patient's Name: {item.name}</Text>
                <Text>Time: {item.time}</Text>
                <Text>Venue: {item.venue}</Text>
                <Text>Status: {item.status ? 'Completed' : 'Pending'}</Text>
              </TouchableOpacity>
              {!item.status && (
                <Button
                  title="Mark as Completed"
                  onPress={() => updateStatus(userId, item, setAppointments)}
                />
              )}
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>No appointments scheduled for today.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  appointmentItem: {
    fontSize: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  completed: {
    backgroundColor: 'lightblue',
  },
  pending: {
    backgroundColor: 'lightcoral',
  },
});

export default SearchPatient;
