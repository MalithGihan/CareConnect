import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet,Pressable,TouchableOpacity } from "react-native";
import { getMedicalReports } from "../../utils/actions/reportAction";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";


const ViewAllRecords = ({ route, navigation }) => {
  const { patient } = route.params || {};
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Route params:", route.params);

    if (!patient || !patient.id) {
      console.error("Patient or patient ID is undefined");
      setLoading(false);
      return;
    }

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
        setFilteredRecords(recordArray);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching records:", error);
        setLoading(false);
      }
    };

    fetchRecords();
  }, [patient]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = records.filter((record) => {
      const { diagnosis, treatment, date } = record;
      const formattedDate = new Date(date).toLocaleDateString();
      return (
        diagnosis.toLowerCase().includes(term.toLowerCase()) ||
        treatment.toLowerCase().includes(term.toLowerCase()) ||
        formattedDate.includes(term)
      );
    });
    setFilteredRecords(filtered);
  };

  const renderRecord = ({ item }) => (
    <View style={styles.recordItem}> 
      <Text style={styles.recordText}>Diagnosis: {item.diagnosis}</Text>
      <Text style={styles.recordText}>Medications: {item.medications}</Text>
      <Text style={styles.recordText}>Treatment: {item.treatment}</Text>
      <Text style={styles.recordText}>Notes: {item.notes}</Text>
      <Text style={[styles.recordText, { marginTop: 20, fontSize: 12, fontWeight:'300',color:'#333', alignSelf:'flex-end' }]}>
        Date: {new Date(item.date).toLocaleDateString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading records...</Text>
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

      <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by diagnosis, treatment, or date"
        value={searchTerm}
        onChangeText={handleSearch}
      />
        <AntDesign
          name="search1"
          size={24}
          color="black"
          style={styles.searchIcon}
        />
      </View>


      

      {filteredRecords.length === 0 ? (
        <Text style={styles.noRecordsText}>No records found</Text>
      ) : (
        <FlatList
          data={filteredRecords}
          keyExtractor={(item) => item.id}
          renderItem={renderRecord}
          contentContainerStyle={styles.recordList}
        />
      )}
    </View>
  );
};

export default ViewAllRecords;

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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    backgroundColor: "white",
    borderRadius: 50,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    padding: 10,
  },
  searchIcon: {
    marginLeft: 10,
  },
  recordItem: {
    flexDirection: "col",
    justifyContent: "flex-start",
    padding: 20,
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
  recordList: { paddingBottom: 20 },
  
  recordText: { fontSize: 14, marginBottom: 5, fontWeight: "600", marginBottom: 8},
  noRecordsText: { textAlign: "center", marginTop: 20, fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
