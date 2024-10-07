import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';

export default function DashboardHP() {

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
      </View>
      <View style={styles.grid}>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#D9E4EC',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    color: '#003366',
  },
  glassButton: {
    width: 140,  
    height: 140, 
    borderRadius: 15,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    fontSize: 16,
    color: '#003366',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',  // Align the grid items vertically centered
    margin: 20,
    alignSelf: 'center',
  },
});