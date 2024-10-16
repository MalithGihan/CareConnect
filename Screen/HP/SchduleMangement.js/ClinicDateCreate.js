import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Toast from 'react-native-toast-message';
import { CreateDateSlots, getDateSlots } from '../../../utils/actions/userActions';
import { ScrollView } from 'react-native-web';

const ClinicDateCreate = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [dateSlots, setDateSlots] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  useEffect(() => {
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
  }, []);

  const updateMarkedDates = (slots) => {
    const newMarkedDates = {};
    Object.keys(slots).forEach((date) => {
      newMarkedDates[date] = { marked: true, dotColor: '#00adf5' };
    });
    setMarkedDates(newMarkedDates);
  };

  const createTimeSlots = () => [
    { time: "9:00 AM - 9:30 AM", booked: false },
    { time: "9:30 AM - 10:00 AM", booked: false },
    { time: "10:00 AM - 10:30 AM", booked: false },
    { time: "10:30 AM - 11:00 AM", booked: false },
    { time: "11:00 AM - 11:30 AM", booked: false },
    { time: "11:30 AM - 12:00 PM", booked: false },
    { time: "1:00 PM - 1:30 PM", booked: false },
    { time: "1:30 PM - 2:00 PM", booked: false },
    { time: "2:00 PM - 2:30 PM", booked: false },
    { time: "2:30 PM - 3:00 PM", booked: false },
  ];

  const onDayPress = (day) => {
    const newSelectedDate = day.dateString;
    setSelectedDate(newSelectedDate);

    if (dateSlots[newSelectedDate] && Array.isArray(dateSlots[newSelectedDate].timeslots.timeslots)) {
      const slots = dateSlots[newSelectedDate].timeslots.timeslots;
      setAvailableTimeSlots(slots);
      console.log("Available Time Slots for selected date:", slots);
    } else {
      setAvailableTimeSlots([]);
      console.log("No time slots available for this date.");
    }

    const updatedMarkedDates = { ...markedDates };
    Object.keys(updatedMarkedDates).forEach(date => {
      if (updatedMarkedDates[date].selected) {
        delete updatedMarkedDates[date].selected;
        delete updatedMarkedDates[date].selectedColor;
      }
    });
    updatedMarkedDates[newSelectedDate] = {
      ...updatedMarkedDates[newSelectedDate],
      selected: true,
      selectedColor: '#4CAF50'
    };
    setMarkedDates(updatedMarkedDates);
  };

  const addAllTimeSlots = async () => {
    if (selectedDate) {
      const newSlots = createTimeSlots();

      try {
        const existingDateSlot = dateSlots[selectedDate];
        if (existingDateSlot && existingDateSlot.timeslots) {
          Toast.show({
            type: 'info',
            text1: 'Date Already Exists',
            text2: `Time slots for ${selectedDate} already exist.`
          });
        } else {
          await CreateDateSlots(selectedDate, { timeslots: newSlots });
          setDateSlots((prevSlots) => ({
            ...prevSlots,
            [selectedDate]: { timeslots: newSlots },
          }));
          setAvailableTimeSlots(newSlots);
          console.log("Time Slots Added:", newSlots);

          setMarkedDates(prevMarkedDates => ({
            ...prevMarkedDates,
            [selectedDate]: {
              ...prevMarkedDates[selectedDate],
              marked: true,
              dotColor: '#00adf5'
            }
          }));

          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: `Time slots for ${selectedDate} added successfully.`
          });
        }
      } catch (err) {
        console.error('Error adding time slots:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to add time slots. Please try again.'
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      
      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
        style={styles.calendar}
      />
      <TouchableOpacity
        onPress={addAllTimeSlots}
        style={styles.button}
        disabled={!selectedDate}
      >
        <Text style={styles.buttonText}>Add All Time Slots</Text>
      </TouchableOpacity>
      {loading && <Text style={{textAlign:'center',margin:20,flex:1,fontWeight:'600'}}>Loading...</Text>}
      {availableTimeSlots.length > 0 ? (
        <FlatList
          data={availableTimeSlots}
          contentContainerStyle={{backgroundColor:'white',padding:15,marginBottom:100,marginTop:20}}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            console.log("Rendering Time Slot:", item);
            return (
              <Text style={[styles.timeSlot, item.booked && styles.bookedTimeSlot]}>
                {item.time}
              </Text>
            );
          }}
        />
      ) : (
        selectedDate && <Text style={styles.noSlotsText}>No time slots available for this date.</Text>
      )}
      <Toast />
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  calendar: {
    alignSelf: "center",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "white",
    width: "95%", 
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom:20 
  },
  button: {
    backgroundColor:'#003366',
      paddingVertical: 8,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical:5
  },
  timeSlot: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bookedTimeSlot: {
    color: 'red',
  },
  noSlotsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default ClinicDateCreate;
