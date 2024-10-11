import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import {
  getMedicalReports,
  addMedicalReport,
  updateMedicalReport,
  deleteMedicalReport, 
} from '../../utils/actions/reportAction'; 
import { useSelector } from "react-redux";

const PatientRecords = ({ route, navigation, loggedInDoctor }) => {
  const { patient } = route.params; 
  const [medicalReports, setMedicalReports] = useState([]);
  const [reportInput, setReportInput] = useState('');
  const [medications, setMedications] = useState('');
  const [notes, setNotes] = useState('');
  const [treatment, setTreatment] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const userData = useSelector((state) => state.auth.userData);

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

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleAddReport = async () => {
    if (reportInput.trim() === '') {
      Alert.alert('Please enter a diagnosis');
      return;
    }

    const newReport = {
      reportId: Date.now().toString(), 
      doctorName: userData.fullName, 
      diagnosis: reportInput.trim(),
      medications: medications.trim(),
      treatment: treatment.trim(),
      notes: notes.trim(),
      time: getCurrentTime(), 
      date: new Date().toISOString(), 
    };

    try {
      await addMedicalReport(patient.id, newReport);
      setMedicalReports([...medicalReports, newReport]);
      setReportInput('');
      setMedications('');
      setNotes('');
      setTreatment('');
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
      doctorName: loggedInDoctor, 
      diagnosis: reportInput.trim(),
      medications: medications.trim(),
      treatment: treatment.trim(),
      notes: notes.trim(),
      time: getCurrentTime(), 
      date: new Date().toISOString(), 
    };

    try {
      await updateMedicalReport(patient.id, editingIndex, updatedReport);
      const updatedReports = [...medicalReports];
      updatedReports[editingIndex] = updatedReport;
      setMedicalReports(updatedReports);
      setReportInput('');
      setMedications('');
      setNotes('');
      setTreatment('');
      setEditingIndex(null);
    } catch (error) {
      console.error('Error updating medical report:', error);
    }
  };

  const handleDeleteReport = async (index) => {
    const reportToDelete = medicalReports[index];

    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMedicalReport(patient.id, reportToDelete.reportId); 
              const updatedReports = medicalReports.filter((_, i) => i !== index);
              setMedicalReports(updatedReports);
            } catch (error) {
              console.error('Error deleting medical report:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderReportItem = ({ item, index }) => (
    <View style={styles.reportItem}>
      <Text style={styles.reportText}>Doctor: {item.doctorName}</Text>
      <Text style={styles.reportText}>Diagnosis: {item.diagnosis}</Text>
      <Text style={styles.reportText}>Medications: {item.medications}</Text>
      <Text style={styles.reportText}>Treatment: {item.treatment}</Text>
      <Text style={styles.reportText}>Notes: {item.notes}</Text>
      <Text style={styles.reportText}>Time: {item.time}</Text>
      <Text style={styles.reportText}>Date: {item.date}</Text>
      <View style={styles.reportActions}>
        <TouchableOpacity
          onPress={() => {
            setEditingIndex(index);
            setReportInput(item.diagnosis);
            setMedications(item.medications);
            setTreatment(item.treatment);
            setNotes(item.notes);
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

      <TextInput
        style={styles.input}
        placeholder="Enter medications"
        value={medications}
        onChangeText={setMedications}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter treatment"
        value={treatment}
        onChangeText={setTreatment}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter additional notes"
        value={notes}
        onChangeText={setNotes}
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
