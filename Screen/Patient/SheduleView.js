import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ToastAndroid } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSelector } from 'react-redux';
import { getUserClinicDates, getUserNotes } from '../../utils/actions/userActions';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function ScheduleView() {
  const [markedDates, setMarkedDates] = useState({});
  const [notes, setNotes] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const userData = useSelector((state) => state.auth.userData);
  const navigation = useNavigation();

  useEffect(() => {
    if (userData && userData.userId) {
      fetchAndDisplayClinicDates(userData.userId);
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

  const fetchAndDisplayClinicDates = async (userId) => {
    try {
      const clinicDates = await getUserClinicDates(userId);
      const markedDatesObj = clinicDates.reduce((acc, date) => {
        acc[date] = {
          selected: true,
          selectedColor: 'blue',
        };
        return acc;
      }, {});
      setMarkedDates(markedDatesObj);
    } catch (error) {
      console.error("Error fetching and displaying clinic dates:", error);
    }
  };

  const fetchUserNotes = async (userId) => {
    try {
      const userNotes = await getUserNotes(userId);
      console.log(userNotes); 
      setNotes(userNotes);
    } catch (error) {
      console.error("Error fetching user notes:", error);
    }
  };

  const handleDayPress = (day) => {
    if (markedDates[day.dateString]) {
      setSelectedDate(day.dateString);
    } else {
      ToastAndroid.show('This is not a clinic date.', ToastAndroid.SHORT);
    }
  };

  const renderNote = ({ item }) => (
    <View style={styles.noteItem}>
      <Text>{item.text}</Text>
      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  const handleAddNotePress = () => {
    navigation.navigate('AddNote', { userId: userData.userId, selectedDate });
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
        <View style={styles.notesSection}>
          <FlatList
            data={notes[selectedDate] ? Object.values(notes[selectedDate]) : []}
            renderItem={renderNote}
            keyExtractor={(item) => item.timestamp.toString()}
            ListHeaderComponent={<Text style={styles.sectionTitle}>Notes for {selectedDate}</Text>}
            ListFooterComponent={notes[selectedDate]?.length === 0 ? <Text>No notes for this date.</Text> : <View style={{ height: 200 }} />}
          />
        </View>
      )}
      {isClinicDate && (
        <TouchableOpacity 
          style={[styles.floatingButton, isClinicDate ? {} : styles.disabledButton]} 
          onPress={handleAddNotePress}
          disabled={!isClinicDate}
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
  notesSection: {
    padding: 20,
    flex: 1,
  },
  scrollView: {
    maxHeight: 200,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
});
