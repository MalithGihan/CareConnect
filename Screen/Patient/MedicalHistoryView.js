import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Pressable, Alert } from 'react-native';
import { fetchAppointments } from '../../utils/actions/userActions';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getUserNotifications } from '../../utils/actions/userActions'; 

export default function MedicalHistoryView() {
  const [appointments, setAppointments] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const userData = useSelector((state) => state.auth.userData);
  const navigation = useNavigation();

  useEffect(() => {
    if (userData && userData.userId) {
      fetchUserNotifications(userData.userId);
    }
  }, [userData]);

  useFocusEffect(
    React.useCallback(() => {
      if (userData && userData.userId) {
        fetchUserNotifications(userData.userId);
      }
    }, [userData])
  );

  useEffect(() => {
    const fetchData = () => {
      fetchAppointments(setAppointments);
    };

    fetchData();
  }, []);

  const fetchUserNotifications = async (userId) => {
    try {
      const notifications = await getUserNotifications(userId);
      const unreadNotifications = notifications.filter(
        (notification) => !notification.read
      );
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error("Error fetching user notifications:", error);
      Alert.alert("Error", "Failed to fetch notifications. Please try again.");
    }
  };

  const renderAppointmentItem = ({ item }) => (
    <View style={styles.appointmentItem}>
      <Text style={styles.dateText}>Date: {item.date}</Text>
      <Text style={styles.timeText}>Time: {item.time}</Text>
      <Text style={styles.doctorText}>Doctor: {item.doctor}</Text>
      {item.doctors_prescription && Object.entries(item.doctors_prescription).map(([key, prescription]) => (
        <View key={key} style={styles.prescriptionItem}>
          <Text style={styles.prescriptionDateText}>Prescription Date: {prescription.createdAt}</Text>
          <Text style={styles.diagnosisText}>Diagnosis: {prescription.diagnosis}</Text>
          <Text style={styles.medicationsText}>Medications: {prescription.medications}</Text>
          <Text style={styles.noteText}>Note: {prescription.note}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashbord")}>
          <Ionicons name="arrow-back-circle" size={40} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Schedule Management
        </Text>
        <View style={styles.rightCorner}>
          <Pressable
            onPress={() => navigation.navigate("notifications")}
            style={styles.notificationIcon}
          >
            <Ionicons name="notifications-outline" size={24} color="black" />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {appointments.length > 0 ? (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={renderAppointmentItem}
        />
      ) : (
        <Text>No appointments available</Text>
      )}
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
    width: "100%",
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
  rightCorner: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 1,
  },
  notificationIcon: {
    position: "relative",
    padding: 5,
  },
  badge: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#FF4136",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 11,
    textAlign: "center",
  },
  appointmentItem: {
    margin:5,
    padding: 15,
    gap:5,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0066cc',
  },
  timeText: {
    fontSize: 16,
    marginBottom: 4,
  },
  doctorText: {
    fontSize: 16,
    marginBottom: 8,
  },
  prescriptionItem: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    marginTop: 8,
    borderRadius: 6,
  },
  prescriptionDateText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  diagnosisText: {
    fontSize: 15,
    marginBottom: 4,
  },
  medicationsText: {
    fontSize: 15,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#555',
  },
});
