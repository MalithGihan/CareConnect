import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import DateSlots from './SchduleMangement.js/DateSlots';
import Appointments from './SchduleMangement.js/Appointments';

export default function HomeScreenHP() {
  const [isAppointmentsView, setIsAppointmentsView] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clinic Schedule Management</Text>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, isAppointmentsView ? styles.activeButton : styles.inactiveButton]}
          onPress={() => setIsAppointmentsView(true)}
        >
          <Text style={styles.buttonText}>Appointments</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !isAppointmentsView ? styles.activeButton : styles.inactiveButton]}
          onPress={() => setIsAppointmentsView(false)}
        >
          <Text style={styles.buttonText}>Date Slots</Text>
        </TouchableOpacity>
      </View>

      {isAppointmentsView ? (
        <Appointments style={styles.appointment} />
      ) : (
        <DateSlots style={styles.dateSlots} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E4EC",
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#D9E4EC",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: "#003366",
    marginBottom: 20,
    marginTop: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  toggleButton: {
    backgroundColor: "#003366",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  activeButton: {
    backgroundColor: '#00BFA5',
  },
  inactiveButton: {
    backgroundColor: '#003366',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    paddingHorizontal:15,
    paddingVertical:10,
  },
  appointment: {
    height: 300,
  },
  dateSlots: {
    height: 300,
  },
});
