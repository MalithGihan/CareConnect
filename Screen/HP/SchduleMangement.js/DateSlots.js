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
    padding: 20,
    height: '100%',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  toggleButton: {
    padding: 15,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
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
  delete: {

  },
});
