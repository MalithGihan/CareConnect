// SearchPatients.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getAllPatients } from '../../utils/actions/userActions';
import { useNavigation } from '@react-navigation/native'; 

const SearchPatients = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);

  const navigation = useNavigation(); 

  
  useEffect(() => {
    const fetchPatients = async () => {
      const allPatients = await getAllPatients();
      setPatients(allPatients);
    };

    fetchPatients();
  }, []);

  // Filter patients based on search query
useEffect(() => {
    if (searchQuery) {
      const filtered = patients.filter((patient) => {
        const name = patient.email || '';
        const nic = patient.nic || '';
        return (
          name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nic.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchQuery, patients]);
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or NIC"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.patientItem}
            onPress={() => navigation.navigate('PatientRecords', { patient: item })} // Navigate to PatientRecords
          >
            <Text style={styles.patientName}>Name: {item.fullName}</Text>
            <Text style={styles.patientDetail}>NIC: {item.nic}</Text>
            <Text style={styles.patientDetail}>Clinic Date: {item.hospital}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.noResultsText}>No patients found</Text>}
      />
    </View>
  );
};

export default SearchPatients;

const styles = StyleSheet.create({
  
});
