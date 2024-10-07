import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';

export default function DashboardHP() {

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <BlurView intensity={50} style={styles.glassButton}>
        <Pressable onPress={() => navigation.navigate('Clinic')}>
          <Text style={styles.buttonText}>Appointment Management</Text>
        </Pressable>
      </BlurView>
      <BlurView intensity={50} style={styles.glassButton}>
        <Pressable onPress={() => navigation.navigate('Clinic Shedule')}>
          <Text style={styles.buttonText}>News Management</Text>
        </Pressable>
      </BlurView>
      <BlurView intensity={50} style={styles.glassButton}>
        <Pressable onPress={() => alert('Button 3')}>
          <Text style={styles.buttonText}>User Management</Text>
        </Pressable>
      </BlurView>
      <BlurView intensity={50} style={styles.glassButton}>
        <Pressable onPress={() => alert('Button 4')}>
          <Text style={styles.buttonText}>Button 4</Text>
        </Pressable>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  glassButton: {
    width: 200,
    height: 50,
    borderRadius: 15,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgb(0.03,0.00,0.10)',
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
