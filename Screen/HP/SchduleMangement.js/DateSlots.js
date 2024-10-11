import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import ClinicSlotDelete from './ClinicSlotDelete';
import ClinicDateCreate from './ClinicDateCreate';

export default function DateSlots() {
  const [isAddingSlots, setIsAddingSlots] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, isAddingSlots ? styles.activeButton : styles.inactiveButton]}
          onPress={() => setIsAddingSlots(true)}
        >
          <Text style={styles.buttonText}>Add Slots</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !isAddingSlots ? styles.activeButton : styles.inactiveButton]}
          onPress={() => setIsAddingSlots(false)}
        >
          <Text style={styles.buttonText}>Delete Slots</Text>
        </TouchableOpacity>
      </View>

      {isAddingSlots ? (
        <ClinicDateCreate />
      ) : (
        < ClinicSlotDelete style={styles.delete} />
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
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  toggleButton: {
    paddingHorizontal: 20,
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
  activeButton: {
    backgroundColor: '#00BFA5',
  },
  inactiveButton: {
    backgroundColor: '#003366',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
