// SearchPatients.js
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getAllPatients } from "../../utils/actions/userActions";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const SearchPatients = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchPatients = async () => {
      const allPatients = await getAllPatients();
      setPatients(allPatients);
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = patients.filter((patient) => {
        const name = patient.email || "";
        const nic = patient.nic || "";
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

  const renderHeader = () => (
    <View >
      <Text style={styles.section}>Patient List</Text>
    </View>
  );

  const renderFooter = () => (
    <View >
      <Text style={styles.section}>
        Total Patients: {filteredPatients.length}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
          }}>
        <TouchableOpacity onPress={() => navigation.navigate("Search Patient")}>
          <Ionicons name="arrow-back-circle" size={40} color="#003366" />
        </TouchableOpacity>
        <Text
          style={styles.titleText}
          numberOfLines={1}
        >
          Search Patient
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or NIC"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <AntDesign
          name="search1"
          size={24}
          color="black"
          style={styles.searchIcon}
        />
      </View>

      <FlatList
        style={styles.recordList}
        data={filteredPatients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          
          <View
            style={styles.recordItem}
          >
             <FontAwesome6 name="circle-user" size={50} color="black" style={{marginLeft:5,marginRight:15,alignSelf:'center'}}/>

            <View>
            <Text style={styles.recordTopic}>Name: {item.name}</Text>
            <Text style={styles.recordText}>NIC: {item.nic}</Text>
            <Text style={styles.recordText}>Clinic Date: {item.email}</Text>
            </View>
            
            <TouchableOpacity onPress={() =>
              navigation.navigate("PatientActions", { patient: item })
            }  style={{marginRight:10,alignSelf:'center',right:25, position:'absolute'}}>
              <Feather name="more-horizontal" size={35} color="#003366" />
            </TouchableOpacity>
            
          </View>
        )}
        ListHeaderComponent={renderFooter}
        ListEmptyComponent={
          <Text style={styles.noRecordsText}>No patients found</Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
  
    </View>
  );
};

export default SearchPatients;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E4EC",
    padding: 15,
  },
  titleText: {
    fontSize: 20,
    marginLeft: 15,
    color: "#003366",
    fontWeight: "900",
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
  section: {
    fontSize: 15,
    fontWeight: "900",
    color: "#003366",
    marginBottom: 20,
  },
  recordList: { paddingBottom: 20 },
  recordItem: {
    flexDirection:'row',
    justifyContent:'flex-start',
    padding: 15,
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 30,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  recordTopic: { fontSize: 16, marginBottom: 5, fontWeight: "900" },
  recordText: { fontSize: 14, marginBottom: 5, fontWeight: "400" },
  noRecordsText: { textAlign: "center", marginTop: 20, fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
