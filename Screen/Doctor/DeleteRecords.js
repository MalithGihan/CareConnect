import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Pressable
} from "react-native";
import {
  getMedicalReports,
  deleteMedicalReport,
} from "../../utils/actions/reportAction";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const DeleteRecord = ({ route, navigation }) => {
  const { patient } = route.params;
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const fetchedRecords = await getMedicalReports(patient.id);
      const recordArray = fetchedRecords
        ? Object.keys(fetchedRecords).map((key) => ({
            id: key,
            ...fetchedRecords[key],
          }))
        : [];
      setRecords(recordArray);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching records:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [patient.id]);

  const handleDeleteRecord = async (recordId) => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMedicalReport(patient.id, recordId);

              fetchRecords();
              Alert.alert("Record deleted successfully");
            } catch (error) {
              console.error("Error deleting record:", error);
              Alert.alert("Error deleting record");
            }
          },
        },
      ]
    );
  };

  const renderRecord = ({ item }) => (
    <View style={styles.recordItem}>
       <View>
      <Text style={styles.recordText}>Diagnosis: {item.diagnosis}</Text>
      <Text style={styles.recordText}>Medications: {item.medications}</Text>
      <Text style={styles.recordText}>Treatment: {item.treatment}</Text>
      <Text style={[styles.recordText,{ marginTop: 20, fontSize: 12 }]}>
        Date: {new Date(item.date).toLocaleDateString()}
      </Text>
      </View> 
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteRecord(item.id)}
      >
        <MaterialCommunityIcons name="delete-circle" size={40} color="red" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 12, fontWeight: "700" }}>Loading records...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("PatientActions", { patient })}
        >
          <Ionicons name="arrow-back-circle" size={40} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.titleText} numberOfLines={1}>
          Delete Medical Record
        </Text>
        <View style={styles.rightCorner}>
          <Pressable
            onPress={() => navigation.navigate("SearchPatients")}
            style={styles.notificationIcon}
          >
            <Ionicons name="search" size={35} color="#003366" />
          </Pressable>
        </View>
      </View>

      {records.length === 0 ? (
        <Text style={styles.noRecordsText}>No records available</Text>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          renderItem={renderRecord}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
};

export default DeleteRecord;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E4EC",
    width: "100%",
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
    color: "#003366",
    flex: 1,
    fontWeight: "900",
    marginLeft: 10,
  },
  recordList: { paddingBottom: 20 },
  recordItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 5,
    backgroundColor: "white",
    borderRadius: 30,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  recordText: { fontSize: 14, marginBottom: 5, fontWeight: "700", marginBottom: 8 },
  deleteButton: {
    position:'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  deleteButtonText: { color: "#fff", fontSize: 16 },
  noRecordsText: { textAlign: "center", marginTop: 20, fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
