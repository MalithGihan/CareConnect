import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { getUsersByRole } from "../../utils/actions/userActions";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";

const RoleBasedUsers = (navigate) => {
  const [roleFilter, setRoleFilter] = useState("patient");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // To handle search input
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const fetchUsers = async (role) => {
    setLoading(true);
    try {
      const users = await getUsersByRole(role);
      setFilteredUsers(users);
    } catch (error) {
      console.error(`Error fetching users for role ${role}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roleFilter && isFocused) {
      fetchUsers(roleFilter);
    }
  }, [roleFilter, isFocused]);

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text) {
      setFilteredUsers((prevUsers) =>
        prevUsers.filter(
          (user) =>
            user.username.toLowerCase().includes(text.toLowerCase()) ||
            user.email.toLowerCase().includes(text.toLowerCase())
        )
      );
    } else {
      fetchUsers(roleFilter);
    }
  };

  const handleEditPress = (user) => {
    navigation.navigate("UserEdit", { user });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>System Users</Text>
      </View>


      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by username or email"
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => setRoleFilter("patient")}
          style={[
            styles.navButton,
            roleFilter === "patient" && styles.activeButton,
          ]}
        >
          <Text style={styles.buttonText}>Patients</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setRoleFilter("doctor")}
          style={[
            styles.navButton,
            roleFilter === "doctor" && styles.activeButton,
          ]}
        >
          <Text style={styles.buttonText}>Doctors</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setRoleFilter("healthProvider")}
          style={[
            styles.navButton,
            roleFilter === "healthProvider" && styles.activeButton,
          ]}
        >
          <Text style={styles.buttonText}>Health Providers</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#003366" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredUsers}
          contentContainerStyle={{paddingBottom:100}}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <View style={styles.userInfo}>
                <Text style={styles.newsFeedTitle}>
                  Username : {item.username}
                </Text>
                <Text>
                  Role :{" "}
                  <Text>
                    {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
                  </Text>
                </Text>
                <Text>Email: {item.email}</Text>
              </View>

              <TouchableOpacity onPress={() => handleEditPress(item)}>
                <Ionicons name="pencil" size={25} color="#003366" />
              </TouchableOpacity>

              
            </View>
          )}
          ListEmptyComponent={<Text>No users found for this role.</Text>}
        />
      )}

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("UserCreate")}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E4EC",
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#D9E4EC",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: "#003366",
    marginBottom: 20,
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 50,
    marginBottom:25,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  navButton: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginHorizontal:5
  },
  navButton: {
    backgroundColor: "#003366",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  activeButton: {
    backgroundColor: "#00BFA5",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  userItem: {
    flexDirection: "row",
    marginHorizontal: 5,
    padding: 15,
    gap: 5,
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
  },
  newsFeedTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  loader: {
    alignSelf: "center",
    flex: 1,
    marginBottom: 150,
  },
  floatingButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#00BFA5",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default RoleBasedUsers;
