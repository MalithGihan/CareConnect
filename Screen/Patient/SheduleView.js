import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ToastAndroid, Alert, Pressable } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSelector } from 'react-redux';
import { getUserClinicAppointments, getUserNotes, getUserNotifications } from '../../utils/actions/userActions';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ScheduleView() {
  const [markedDates, setMarkedDates] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [notes, setNotes] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const userData = useSelector((state) => state.auth.userData);
  const navigation = useNavigation();

  useEffect(() => {
    if (userData && userData.userId) {
      fetchAndDisplayClinicAppointments(userData.userId);
      fetchUserNotes(userData.userId);
      fetchUserNotifications(userData.userId);
    }
  }, [userData]);

  useFocusEffect(
    React.useCallback(() => {
      if (userData && userData.userId) {
        fetchUserNotes(userData.userId);
        fetchUserNotifications(userData.userId);
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

  const fetchUserNotifications = async (userId) => {
    try {
      const notifications = await getUserNotifications(userId);
      const unreadNotifications = notifications.filter(notification => !notification.read);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error("Error fetching user notifications:", error);
      Alert.alert("Error", "Failed to fetch notifications. Please try again.");
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedules</Text>
        <Pressable onPress={() => navigation.navigate("notifications")} style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={24} color="black" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </Pressable>
      </View>
      <Calendar
        style={styles.calendarStyle}
        markedDates={markedDates}
        onDayPress={handleDayPress}
      />
      {selectedDate && (
        <View style={styles.Section}>
          <LinearGradient
            colors={['rgba(0, 51, 102, 0.2)', 'rgba(0, 191, 165, 0.2)']} style={styles.detailsSection}>
            <View style={styles.upSection}>
              <Text style={styles.sectionTitle}>Appointments for {selectedDate}</Text>
              <FlatList
                data={appointments.filter(apt => apt.date === selectedDate)}
                renderItem={renderAppointment}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text>No appointments for this date.</Text>}
              />
            </View>
          </LinearGradient>
          <LinearGradient
            colors={['rgba(0, 51, 102, 0.2)', 'rgba(0, 191, 165, 0.2)']} style={styles.detailsSection}>
            <Text style={{ ...styles.sectionTitle, fontSize: 20, marginLeft: 20, color: 'white' }}>Notes</Text>
            <View style={styles.bottomSection}>

              <FlatList style={styles.bottomitem}
                data={notes[selectedDate] ? Object.values(notes[selectedDate]) : []}
                renderItem={renderNote}
                keyExtractor={(item) => item.timestamp.toString()}
                ListEmptyComponent={<Text>No notes for this date.</Text>}
              />
            </View>
          </LinearGradient>
        </View>
      )}
      {isClinicDate && (
       <LinearGradient
       colors={['rgba(0, 51, 102, 0.2)', 'rgba(0, 191, 165, 0.2)']}
          style={styles.floatingButton}
          onPress={handleAddNotePress}
        >
          <Ionicons name="add" size={30} color="white" />
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9E4EC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#D9E4EC',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
  },
  detailsSection: {
    borderRadius: 20,
    margin: 10,
    flex: 1
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    marginLeft:20
  },
  appointmentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  appointmentText: {
    fontSize: 16,
  },
  noteItem: {
    marginVertical: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 15
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
    backgroundColor: 'rgba(0,122,255,0.5)',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  notificationIcon: {
    position: 'relative',
    padding: 5,
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#FF4136',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'center',
  },
  calendarStyle: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    backgroundColor: 'white',
    width: '90%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  upSection: {
    backgroundColor: 'white',
    margin: 10,
    
    marginHorizontal: 15,
    flex: 1,
    borderRadius: 15,
  },
  bottomSection: {
    marginHorizontal: 15,
    flex: 1,
    paddingBottom:10
  },

  Section: {
    flex: 1,
    marginHorizontal:10
  }
});