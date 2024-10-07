import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { getAuth } from 'firebase/auth';
import { Calendar } from 'react-native-calendars';
import { fetchClinicDatestoDoc, handleDatePress } from '../../utils/actions/userActions';

const DashboardDoctor = () => {
  const [clinicDates, setClinicDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [appointments, setAppointments] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userId = currentUser ? currentUser.uid : null;

  useEffect(() => {
    const loadClinicDates = async () => {
      if (userId) {
        const dates = await fetchClinicDatestoDoc(userId);
        setClinicDates(dates);
      }
    };
    loadClinicDates();
  }, [userId]);

  const onDayPress = async (day) => {
    setSelectedDate(day.dateString);
    if (userId) {
      await handleDatePress(userId, day, setAppointments);
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={clinicDates}
        markingType={'dot'}
        onDayPress={onDayPress}
      />
      {selectedDate && (
        <View style={styles.appointmentList}>
          <Text style={styles.subtitle}>Appointments for {selectedDate}:</Text>
          {appointments.length > 0 ? (
            <FlatList
              data={appointments}
              renderItem={({ item }) => (
                <View style={styles.appointmentItem}>
                  <Text>Patient's Name: {item.name}</Text>
                  <Text>Time: {item.time}</Text>
                  <Text>Venue: {item.venue}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <Text>No appointments scheduled for this date.</Text>
          )}
        </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  appointmentList: {
    marginTop: 20,
  },
  appointmentItem: {
    fontSize: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
});

export default DashboardDoctor;
