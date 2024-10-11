import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import { getMedicalReports } from "../../utils/actions/reportAction";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import DateTimePicker from '@react-native-community/datetimepicker';

const UpdateRecord = ({ route, navigation }) => {
  const { patient, initialValues } = route.params;
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null); 
  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [loading, setLoading] = useState(true);


  const fetchRecords = async () => {
    setLoading(true);
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
    } catch (error) {
      console.error("Error fetching records:", error);
      Alert.alert("Error", "Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();

    const unsubscribe = navigation.addListener("focus", () => {
      fetchRecords();
    });

    return unsubscribe;
  }, [navigation, patient.id]);

 
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || null;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };


  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = records.filter((record) => {
      const { diagnosis, treatment, medications, date } = record;
      const formattedDate = new Date(date).toLocaleDateString();

      
      const matchesSearchTerm =
        diagnosis.toLowerCase().includes(term.toLowerCase()) ||
        treatment.toLowerCase().includes(term.toLowerCase()) ||
        medications.toLowerCase().includes(term.toLowerCase());

      const matchesDate =
        !selectedDate || formattedDate === new Date(selectedDate).toLocaleDateString();

      return matchesSearchTerm && matchesDate;
    });
    setFilteredRecords(filtered);
  };

  const handleRecordSelect = (record) => {
    navigation.navigate("Addmedical", {
      patient,
      initialValues: record,
    });
  };

  const renderRecord = ({ item }) => (
    <View style={styles.recordItem}>
      <View>
        <Text style={styles.recordText}>Diagnosis: {item.diagnosis}</Text>
        <Text style={styles.recordText}>Medications: {item.medications}</Text>
        <Text style={styles.recordText}>Treatment: {item.treatment}</Text>
        <Text style={[styles.recordText, { marginTop: 20, fontSize: 12 }]}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => handleRecordSelect(item)}
        style={{ marginRight: 10, alignSelf: "center", right: 25, position: "absolute" }}
      >
        <AntDesign name="rightcircleo" size={35} color="#003366" />
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
          Update Medical Record
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

  
      <View style={styles.datePickerContainer}>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.datePickerButton}
        >
          <Text style={styles.datePickerText}>
            {selectedDate
              ? `Filter by Date: ${new Date(selectedDate).toLocaleDateString()}`
              : "Select Date"}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

     
      {filteredRecords.length === 0 ? (
        <Text style={styles.noRecordsText}>No records found</Text>
      ) : (
        <FlatList
          data={filteredRecords}
          keyExtractor={(item) => item.id}
          renderItem={renderRecord}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
};

export default UpdateRecord;

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
  datePickerContainer: {
    marginVertical: 10,
  },
  datePickerButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  datePickerText: {
    color: "#003366",
    fontWeight: "700",
  },
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
  noRecordsText: { textAlign: "center", marginTop: 20, fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
