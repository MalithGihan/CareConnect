import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Toast from 'react-native-toast-message';
import { getDateSlots, getPatientsByClinicDate, sendUserNotification, deleteClinicDateAndAppointments, recordCancellation } from '../../../utils/actions/userActions';
import { useFocusEffect } from '@react-navigation/native';

const ClinicSlotDelete = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [dateSlots, setDateSlots] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [cancellationReason, setCancellationReason] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      const fetchDateSlots = async () => {
        try {
          setLoading(true);
          const slots = await getDateSlots();
          console.log("Fetched date slots from Firebase:", slots);
          setDateSlots(slots);
          updateMarkedDates(slots);
        } catch (err) {
          console.error('Error fetching date slots:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchDateSlots();
    }, [])
  );

  const updateMarkedDates = (slots) => {
    const newMarkedDates = {};
    Object.keys(slots).forEach((date) => {
      newMarkedDates[date] = { marked: true, dotColor: '#00adf5' };
    });
    setMarkedDates(newMarkedDates);
  };

  const onDayPress = async (day) => {
    const newSelectedDate = day.dateString;
    setSelectedDate(newSelectedDate);

    const updatedMarkedDates = { ...markedDates };
    Object.keys(updatedMarkedDates).forEach((date) => {
      if (updatedMarkedDates[date].selected) {
        delete updatedMarkedDates[date].selected;
        delete updatedMarkedDates[date].selectedColor;
      }
    });
    updatedMarkedDates[newSelectedDate] = {
      ...updatedMarkedDates[newSelectedDate],
      selected: true,
      selectedColor: '#4CAF50',
    };
    setMarkedDates(updatedMarkedDates);

    const patientsData = await getPatientsByClinicDate(newSelectedDate);
    setPatients(patientsData);
    console.log("Patients for the selected date:", patientsData);
  };

  const handleCancelClinicDate = async () => {
    if (!cancellationReason) {
      Toast.show({ text1: 'Please provide a reason for cancellation.', type: 'error' });
      return;
    }

    try {
      await deleteClinicDateAndAppointments(selectedDate);

      for (const patient of patients) {
        const notification = {
          date: new Date().toISOString(),
          reason: cancellationReason,
          clinicDate: selectedDate,
        };
        await sendUserNotification(patient.id, notification);
      }
      await recordCancellation(selectedDate, cancellationReason, patients);

      setDateSlots((prevSlots) => {
        const newSlots = { ...prevSlots };
        delete newSlots[selectedDate];
        return newSlots;
      });
      updateMarkedDates(dateSlots);

      setSelectedDate('');
      setPatients([]);
      setCancellationReason('');
      Toast.show({ text1: 'Clinic date canceled successfully!', type: 'success' });
    } catch (error) {
      console.error('Error canceling clinic date:', error);
      Toast.show({
        text1: 'Failed to cancel clinic date',
        text2: error.message || 'Please try again',
        type: 'error'
      });
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
        style={styles.calendar}
      />
      {loading && <Text>Loading...</Text>}
      {patients.length > 0 ? (
        <View style={styles.list}>
        <FlatList 
          data={patients}
          keyExtractor={(patient) => patient.id}
          renderItem={({ item }) => (
            <Text style={styles.patientItem}>
              {item.name} - {item.email}
            </Text>
          )}
        />
        </View>
      ) : (
        <Text style={styles.noSlotsText}>No patients available for this date.</Text>
      )}
      {selectedDate ? (
        <TextInput
          style={styles.reasonInput}
          placeholder="Reason for cancellation"
          value={cancellationReason}
          onChangeText={setCancellationReason}
        />
      ) : null}
      {selectedDate ? (
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelClinicDate}>
          <Text style={styles.cancelButtonText}>Cancel Clinic Date</Text>
        </TouchableOpacity>
      ) : null}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom:20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  calendar: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  list:{
    height:80
  },
  noSlotsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  patientItem: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
});
export default ClinicSlotDelete;
