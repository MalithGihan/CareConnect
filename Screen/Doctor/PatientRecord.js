// PatientRecords.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import {
  getMedicalReports,
  addMedicalReport,
  updateMedicalReport,
  deleteMedicalReport,
} from '../../utils/actions/reportAction'; 

const PatientRecords = ({ route, navigation }) => {
  const { patient } = route.params;
  const [medicalReports, setMedicalReports] = useState([]);
  const [reportInput, setReportInput] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reports = await getMedicalReports(patient.id);
        setMedicalReports(reports || []);
      } catch (error) {
        console.error('Error fetching medical reports:', error);
      }
    };

    fetchReports();
  }, [patient.id]);

  const handleAddReport = async () => {
    if (reportInput.trim() === '') {
      Alert.alert('Please enter a report');
      return;
    }

    const newReport = {
      reportId: Date.now().toString(), // Unique ID
      doctorName: 'Dr. John Doe', // Replace with actual doctor name if available
      diagnosis: reportInput.trim(),
      treatment: 'Treatment details', // You can add a field for treatment input
      date: new Date().toISOString(),
    };

    try {
      await addMedicalReport(patient.id, newReport);
      setMedicalReports([...medicalReports, newReport]);
      setReportInput('');
    } catch (error) {
      console.error('Error adding medical report:', error);
    }
  };

  const handleUpdateReport = async () => {
    if (reportInput.trim() === '') {
      Alert.alert('Please enter a report to update');
      return;
    }

    const updatedReport = {
      ...medicalReports[editingIndex],
      diagnosis: reportInput.trim(),
      date: new Date().toISOString(),
    };

    try {
      await updateMedicalReport(patient.id, editingIndex, updatedReport);
      const updatedReports = [...medicalReports];
      updatedReports[editingIndex] = updatedReport;
      setMedicalReports(updatedReports);
      setReportInput('');
      setEditingIndex(null);
    } catch (error) {
      console.error('Error updating medical report:', error);
    }
  };

  const handleDeleteReport = async (index) => {
    try {
      await deleteMedicalReport(patient.id, index);
      const updatedReports = medicalReports.filter((_, i) => i !== index);
      setMedicalReports(updatedReports);
    } catch (error) {
      console.error('Error deleting medical report:', error);
    }
  };

  const renderReportItem = ({ item, index }) => (
    <View style={styles.reportItem}>
      <Text style={styles.reportText}>Diagnosis: {item.diagnosis}</Text>
      <Text style={styles.reportText}>Date: {item.date}</Text>
      <View style={styles.reportActions}>
        <TouchableOpacity
          onPress={() => {
            setEditingIndex(index);
            setReportInput(item.diagnosis);
          }}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteReport(index)}>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.patientName}>Patient: {patient.name}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter diagnosis"
        value={reportInput}
        onChangeText={setReportInput}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={editingIndex !== null ? handleUpdateReport : handleAddReport}
      >
        <Text style={styles.buttonText}>{editingIndex !== null ? 'Update Report' : 'Add Report'}</Text>
      </TouchableOpacity>

      <FlatList
        data={medicalReports}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderReportItem}
        ListEmptyComponent={<Text style={styles.noReportsText}>No medical reports available.</Text>}
      />
    </View>
  );
};

export default PatientRecords;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  patientName: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontSize: 16 },
  reportItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  reportText: { fontSize: 16 },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionText: { color: '#0066cc' },
  noReportsText: { textAlign: 'center', color: '#666', marginTop: 20 },
});
