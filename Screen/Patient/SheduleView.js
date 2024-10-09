import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  Pressable,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useSelector } from "react-redux";
import {
  getUserClinicAppointments,
  getUserNotes,
  getUserNotifications,
} from "../../utils/actions/userActions";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ScheduleView() {
  const [markedDates, setMarkedDates] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [notes, setNotes] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const userData = useSelector((state) => state.auth.userData);
  const navigation = useNavigation();

  useEffect(() => {
    if (userData && userData.userId) {
      fetchAndDisplayClinicAppointments(userData.userId);
      fetchUserNotes(userData.userId);
      fetchUserNotifications(userData.userId);
    }
  }, [userData]);

  useFocusEffect(
    React.useCallback(() => {
      if (userData && userData.userId) {
        fetchUserNotes(userData.userId);
        fetchUserNotifications(userData.userId);
      }
    }, [userData])
  );

  useEffect(() => {
    if (selectedDate && userData) {
      fetchUserNotes(userData.userId);
    }
  }, [selectedDate]);

  const fetchAndDisplayClinicAppointments = async (userId) => {
    try {
      const clinicAppointments = await getUserClinicAppointments(userId);
      setAppointments(clinicAppointments);
      const markedDatesObj = clinicAppointments.reduce((acc, appointment) => {
        acc[appointment.date] = {
          selected: true,
          selectedColor: "#00BFA5",
          marked: true,
          dotColor: "red",
        };
        return acc;
      }, {});
      setMarkedDates(markedDatesObj);
    } catch (error) {
      console.error(
        "Error fetching and displaying clinic appointments:",
        error
      );
      Alert.alert(
        "Error",
        "Failed to fetch clinic appointments. Please try again."
      );
    }
  };

  const fetchUserNotes = async (userId) => {
    try {
      const userNotes = await getUserNotes(userId);
      setNotes(userNotes);
    } catch (error) {
      console.error("Error fetching user notes:", error);
      Alert.alert("Error", "Failed to fetch notes. Please try again.");
    }
  };

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

  const handleDayPress = (day) => {
    if (markedDates[day.dateString]) {
      setSelectedDate(day.dateString);
    } else {
      ToastAndroid.show("This is not a clinic date.", ToastAndroid.SHORT);
    }
  };

  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentItem}>
      <Text style={[styles.appointmentText,{fontSize:15,fontWeight:"300",marginBottom:10}]}>Your next clinic appointment has been scheduled as follows:</Text>
      <Text style={[styles.appointmentText,{fontSize:25,fontWeight:"900"}]}>Dr. {item.doctor}</Text>
      <Text style={[styles.appointmentText,{fontSize:20,fontWeight:"900"}]}>Venue: {item.venue}</Text>
      <Text style={[styles.appointmentText,{fontSize:20,fontWeight:"900"}]}>Time: {item.time}</Text>
      <Text style={[styles.appointmentText,{fontSize:15,fontWeight:"300",marginTop:10}]}>Please arrive on time and bring any necessary documents.</Text>
    </View>
  );

  const renderNote = ({ item }) => (
    <View style={styles.appointmentItem}>
      <Text style={[styles.appointmentText,{fontSize:15,fontWeight:"300",marginBottom:10}]}>{item.text}</Text>
      <Text style={[styles.appointmentText,{fontSize:12,fontWeight:"600",marginTop:10}]}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  const handleAddNotePress = () => {
    const selectedAppointment = appointments.find(
      (apt) => apt.date === selectedDate
    );
    if (selectedAppointment) {
      navigation.navigate("AddNote", {
        userId: userData.userId,
        appointmentId: selectedAppointment.id,
      });
    } else {
      ToastAndroid.show(
        "No appointment found for this date.",
        ToastAndroid.SHORT
      );
    }
  };

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const dayWithSuffix = day + getDaySuffix(day);
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${dayWithSuffix} of ${month}, ${year}`;
  };

  const isClinicDate = selectedDate && markedDates[selectedDate];

  if (!userData || !userData.userId) {
    return <Text>Loading user data...</Text>;
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          marginBottom: 25,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Dashbord")}>
          <Ionicons name="arrow-back-circle" size={40} color="#003366" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            marginLeft: 15,
            color: "#003366",
            flex: 1,
            fontWeight: "900",
          }}
          numberOfLines={1}
        >
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

      <Calendar
        style={styles.calendarStyle}
        markedDates={markedDates}
        onDayPress={handleDayPress}
      />

      {selectedDate && (
        <FlatList
          data={appointments.filter((apt) => apt.date === selectedDate)}
          renderItem={renderAppointment}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          ListHeaderComponent={() => (
            <View>
                <Text style={styles.sectionTitle}>
                  {formatDate(selectedDate)}
                </Text>
            </View>
          )}
          ListFooterComponent={() => (
            <LinearGradient
              colors={["rgba(0, 191, 165, 0.3)", "rgba(0, 51, 102, 0.3)"]}
              style={styles.detailsSection}
            >
              <Text
                style={[styles.sectionTitle,{}]}
              >
                Notes
              </Text>
              <FlatList
                data={
                  notes[selectedDate] ? Object.values(notes[selectedDate]) : []
                }
                renderItem={renderNote}
                keyExtractor={(item, index) =>
                  item.timestamp ? item.timestamp.toString() : index.toString()
                }
                ListEmptyComponent={<Text style={[styles.appointmentText,{fontSize:15,fontWeight:"300",marginBottom:10,marginHorizontal:5}]}>No notes for this date.</Text>}
                nestedScrollEnabled={true} 
              />
            </LinearGradient>
          )}
          ListEmptyComponent={<Text>No appointments for this date.</Text>}
          nestedScrollEnabled={true} 
        />
      )}

      {isClinicDate && (
        <LinearGradient
          colors={["rgba(0, 51, 102, 0.2)", "rgba(0, 191, 165, 0.2)"]}
          style={styles.floatingButton}
          onPress={handleAddNotePress}
        >
          <Ionicons name="add" size={30} color="white" />
        </LinearGradient>
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
  rightCorner: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 1,
  },
  detailsSection: {
    borderRadius: 20,
    marginTop: 25,
    marginBottom:150,
    paddingVertical: 10,
    paddingHorizontal: 15, 
    backgroundColor: "white", 
    shadowColor: "#000", 
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginVertical:15,
    marginHorizontal:5,
    color: "#003366",
  },
  appointmentItem: {
    marginHorizontal:5,
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
  appointmentText: {
    color: "#003366",
  },
  noteItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 10,
    marginHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
  },
  floatingButton: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 100,
    backgroundColor: "#00BFA5",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
    zIndex:1
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
  calendarStyle: {
    alignSelf: "center",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "white",
    width: "95%", // Fixed width percentage (removed space between %)
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: 10, // Added for spacing below calendar
  },
  upSection: {
    backgroundColor: "white",
    margin: 10,
    marginHorizontal: 15,
    flex: 1,
    borderRadius: 15,
    padding: 10, // Added padding inside the section
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  bottomSection: {
    marginHorizontal: 15,
    flex: 1,
    paddingBottom: 10,
  },
  Section: {
    flex: 1,
    marginHorizontal: 10,
  },
});
