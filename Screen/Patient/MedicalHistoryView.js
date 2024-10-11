import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getMedicalReports } from "../../utils/actions/reportAction";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";


export default function MedicalHistoryView() {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [visibleDate, setVisibleDate] = useState(""); // For showing the currently visible date
  const userData = useSelector((state) => state.auth.userData);
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [visibleDay, setVisibleDay] = useState("");
  const [visibleMonth, setVisibleMonth] = useState("");
  const [visibleYear, setVisibleYear] = useState("");

  useEffect(() => {
    if (userData && userData.userId) {
      fetchMedicalReports(userData.userId);
    }
  }, [userData]);

  const fetchMedicalReports = async (userId) => {
    try {
      const records = await getMedicalReports(userId);
      setMedicalRecords(records);
      setFilteredRecords(records);
    } catch (error) {
      console.error("Error fetching medical records:", error);
      Alert.alert(
        "Error",
        "Failed to fetch medical records. Please try again."
      );
    }
  };

  const filterRecords = () => {
    let filtered = medicalRecords;

    if (searchQuery) {
      filtered = filtered.filter(
        (record) =>
          record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.medications.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (record) =>
          new Date(record.date).toDateString() ===
          new Date(selectedDate).toDateString()
      );
    }

    setFilteredRecords(filtered);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
    filterRecords();
  };

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const firstVisibleItem = viewableItems[0];
      const recordDate = new Date(firstVisibleItem.item.date);

      const day = recordDate.getDate();
      const month = recordDate.toLocaleString("default", { month: "long" }); // Get full month name
      const year = recordDate.getFullYear();

      setVisibleDay(day);
      setVisibleMonth(month);
      setVisibleYear(year);
    }
  };

  const handleGenerateQRCode = () => {
    navigation.navigate('QRCode', { medicalReports: filteredRecords });
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, // This decides when an item is considered visible
  };

  const renderMedicalRecordItem = ({ item }) => {
    const recordDate = new Date(item.date);

    const formattedDate = recordDate.toLocaleDateString();
    const formattedTime = recordDate.toLocaleTimeString();

    return (
      <LinearGradient
        colors={["rgba(0, 51, 102, 0.3)", "rgba(0, 191, 165, 0.3)"]}
        style={styles.appointmentItem}
      >
        <Text style={styles.doctorText}>Doctor: {item.doctor}</Text>
        <Text style={styles.doctorText}>Diagnosis: {item.diagnosis}</Text>
        <Text style={styles.doctorText}>
          Medications: {item.medications}
        </Text>
        <Text style={styles.doctorText}>Notes: {item.notes}</Text>
        <Text style={styles.dateText}>
          Date: {formattedDate} | Time: {formattedTime}
        </Text>
      </LinearGradient>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Ionicons name="arrow-back-circle" size={40} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical History</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchContainer2}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by doctor, diagnosis, or medication"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              filterRecords();
            }}
          />
          <AntDesign
            name="search1"
            size={24}
            color="black"
            style={styles.searchIcon}
          />
        </View>

        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateFilter}>
            {selectedDate
              ? new Date(selectedDate).toDateString()
              : "Select Date"}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <View style={styles.floatingDate}>
        <Text style={styles.floatingDateText}>{visibleMonth}</Text>
        <Text style={styles.floatingDateText}>{visibleYear}</Text>
      </View>

      <View
        style={{
          width: 50,
          height: 50,
          backgroundColor: "#00BFA5",
          borderRadius: 60,
          margin: 5,
          shadowColor: "#000",
          shadowOffset: { width: 2, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 5,
          justifyContent: "center", // Center vertically
          alignItems: "center", // Center horizontally
        }}
      >
        <Text style={styles.floatingDateText2}>{visibleDay}</Text>
      </View>

      {filteredRecords.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={filteredRecords}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderMedicalRecordItem}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      ) : (
        <Text>No medical records found.</Text>
      )}

<TouchableOpacity
        style={styles.floatingButton}
        onPress={handleGenerateQRCode}
      >
        <AntDesign name="qrcode" size={40} color="white" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E4EC",
    padding: 15,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 20,
    marginLeft: 15,
    color: "#003366",
    flex: 1,
    fontWeight: "900",
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  searchContainer2: {
    width: "70%",
    flexDirection: "row",
    alignItems: "center",
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
  dateFilter: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: "white",
    borderRadius: 50,
    color: "#003366",
    fontSize: 11,
    fontWeight: "900",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  appointmentItem: {
    margin: 5,
    marginLeft: 50,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  dateText: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 15,
    color: "#333",
  },
  doctorText: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight:'700'
  },
  floatingDate: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginVertical: 15,
    zIndex: 999,
  },
  floatingDateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003366",
    alignSelf: "center",
  },
  floatingDateText2: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: '#00BFA5',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
