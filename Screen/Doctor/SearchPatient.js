import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button,Pressable } from 'react-native';
import { getAuth } from 'firebase/auth';
import { fetchAppointmentsForToday, updateStatus } from '../../utils/actions/userActions';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import CommonNavBtn from '../../Components/CommonNavBtn';

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
      <View style={styles.headerContainer}>
        <Text style={styles.titleText} numberOfLines={1}>
          Medical History Management
        </Text>
        <View style={styles.rightCorner}>
          <Pressable
            onPress={() => navigation.navigate("SearchPatients")}
            style={styles.notificationIcon}
          >
            <Ionicons name="add-circle" size={45} color="#003366" />
          </Pressable>
         </View> 
      </View>

      <Text style={styles.subtitle}>Appointments for today</Text>
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
          
                <CommonNavBtn
                onPress={() => updateStatus(userId, item, setAppointments)}
                title="Marks as Completed"
                style={{ backgroundColor: "#003366" }}
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
    backgroundColor: "#D9E4EC",
    padding: 15,
  },
  rightCorner: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
  notificationIcon: {
    position: "relative",
    padding: 5,
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginBottom: 25,
  },
  titleText: {
    fontSize: 20,
    marginTop: 10,
    color: "#003366",
    flex: 1,
    fontWeight: "900",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#003366",
    marginBottom: 20,
  },
  appointmentItem: {
    flexDirection: "colum",
    justifyContent: "flex-start",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom:15,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  completed: {
    backgroundColor: 'lightblue',
  },
  pending: {
    backgroundColor: 'lightcoral',
  },
});

export default SearchPatient;
