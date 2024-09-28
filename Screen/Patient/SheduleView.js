import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSelector } from 'react-redux';
import { getUserClinicAppointments, getUserNotes } from '../../utils/actions/userActions';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function ScheduleView() {
  const [markedDates, setMarkedDates] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [notes, setNotes] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const userData = useSelector((state) => state.auth.userData);
  const navigation = useNavigation();

  useEffect(() => {
    if (userData && userData.userId) {
      fetchAndDisplayClinicAppointments(userData.userId);
      fetchUserNotes(userData.userId);
    }
  }, [userData]);

  useFocusEffect(
    React.useCallback(() => {
      if (userData && userData.userId) {
        fetchUserNotes(userData.userId);
      }
    }, [userData])
  );

  useEffect(() => {
    if (selectedDate && userData) {
      fetchUserNotes(userData.userId);
    }
  }, [selectedDate]);

  const fetchAndDisplayClinicAppointments = async (userId) => {
    try {
      const clinicAppointments = await getUserClinicAppointments(userId);
      setAppointments(clinicAppointments);
      const markedDatesObj = clinicAppointments.reduce((acc, appointment) => {
        acc[appointment.date] = {
          selected: true,
          selectedColor: 'blue',
          marked: true,
          dotColor: 'red',
        };
        return acc;
      }, {});
      setMarkedDates(markedDatesObj);
    } catch (error) {
      console.error("Error fetching and displaying clinic appointments:", error);
      Alert.alert("Error", "Failed to fetch clinic appointments. Please try again.");
    }
  };

  const fetchUserNotes = async (userId) => {
    try {
      const userNotes = await getUserNotes(userId);
      setNotes(userNotes);
    } catch (error) {
      console.error("Error fetching user notes:", error);
      Alert.alert("Error", "Failed to fetch notes. Please try again.");
    }
  };

  const handleDayPress = (day) => {
    if (markedDates[day.dateString]) {
      setSelectedDate(day.dateString);
    } else {
      ToastAndroid.show('This is not a clinic date.', ToastAndroid.SHORT);
    }
  };

  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentItem}>
      <Text style={styles.appointmentText}>Dr. {item.doctor}</Text>
      <Text style={styles.appointmentText}>Venue: {item.venue}</Text>
      <Text style={styles.appointmentText}>Time: {item.time}</Text>
    </View>
  );

  const renderNote = ({ item }) => (
    <View style={styles.noteItem}>
      <Text>{item.text}</Text>
      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  const handleAddNotePress = () => {
    const selectedAppointment = appointments.find(apt => apt.date === selectedDate);
    if (selectedAppointment) {
      navigation.navigate('AddNote', { userId: userData.userId, appointmentId: selectedAppointment.id });
    } else {
      ToastAndroid.show('No appointment found for this date.', ToastAndroid.SHORT);
    }
  };

  const isClinicDate = selectedDate && markedDates[selectedDate];

  if (!userData || !userData.userId) {
    return <Text>Loading user data...</Text>;
  }

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
      />
      {selectedDate && (
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Appointments for {selectedDate}</Text>
          <FlatList
            data={appointments.filter(apt => apt.date === selectedDate)}
            renderItem={renderAppointment}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text>No appointments for this date.</Text>}
          />
          <Text style={styles.sectionTitle}>Notes</Text>
          <FlatList
            data={notes[selectedDate] ? Object.values(notes[selectedDate]) : []}
            renderItem={renderNote}
            keyExtractor={(item) => item.timestamp.toString()}
            ListEmptyComponent={<Text>No notes for this date.</Text>}
          />
        </View>
      )}
      {isClinicDate && (
        <TouchableOpacity 
          style={styles.floatingButton} 
          onPress={handleAddNotePress}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  detailsSection: {
    padding: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  appointmentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  appointmentText: {
    fontSize: 16,
    marginBottom: 5,
  },
  noteItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  floatingButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});