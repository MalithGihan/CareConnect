import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import DateSlots from './SchduleMangement.js/DateSlots';
import Appointments from './SchduleMangement.js/Appointments';

export default function HomeScreenHP() {
  const [isAppointmentsView, setIsAppointmentsView] = useState(true);

  return (
    <View style={styles.container}>
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
    backgroundColor: '#f5f5f5',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  toggleButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#4CAF50',
  },
  inactiveButton: {
    backgroundColor: '#ddd',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  appointment: {
    height: 300,
  },
  dateSlots: {
    height: 300,
  },
});
