import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "../../utils/actions/userActions";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Notifications() {
  const userData = useSelector((state) => state.auth.userData);
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (userData && userData.userId) {
      fetchUserNotifications(userData.userId);
    }
  }, [userData]);

  const fetchUserNotifications = async (userId) => {
    try {
      const notificationsData = await getUserNotifications(userId);
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(userData.userId, notificationId);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const renderNotification = ({ item }) => {
    if (item.title) {
      return (
        <View style={styles.notificationItem}>
          <View style={styles.top}>
            
            <Text style={styles.datetamp}>
              {new Date(item.dateC).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
            <Pressable
              onPress={() => handleMarkAsRead(item.id)}
              style={[
                styles.readButton,
                item.read ? styles.readButtonRead : styles.readButtonUnread,
              ]}
            >
              <Text style={{color:"white"}}>{item.read ? "Read" : "Mark as Read"}</Text>
            </Pressable>
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text>Date: {item.date}</Text>
          <Text>Time: {item.Time}</Text>
          <Text>Venue: {item.venue}</Text>
          <Text>Doctor: {item.doctor}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.dateC).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.notificationItem}>
          <View style={styles.top}>
            
            <Text style={styles.datetamp}>
              {new Date(item.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
            <Pressable
              onPress={() => handleMarkAsRead(item.id)}
              style={[
                styles.readButton,
                item.read ? styles.readButtonRead : styles.readButtonUnread,
              ]}
            >
              <Text style={{color:"white"}}>{item.read ? "Read" : "Mark as Read"}</Text>
            </Pressable>
          </View>
          <Text style={styles.title}>
            <Text style={styles.symbol}> !! </Text>
            Clinic Appointment Cancelled
            <Text style={styles.symbol}> !! </Text>
          </Text>
          <Text>Cancelled Date: {item.clinicDate}</Text>
          <Text>Reason: {item.reason}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.date).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          marginBottom: 10,
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
      </View>
      <LinearGradient
        colors={["rgba(0, 51, 102, 0.2)", "rgba(0, 191, 165, 0.2)"]}
        style={styles.notificationcontainer}
      >
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text>No notifications available.</Text>}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E4EC",
    padding: 15,
  },
  top: {
    flexDirection: "row",
    justifyContent: 'space-between',
    gap:9
  },
  notificationItem: {
    backgroundColor: "white",
    margin: 15,
    padding: 10,
    marginBottom: 10,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  symbol: {
    color: "red",
    fontWeight: "bold",
    fontSize: 20,
  },
  title: {
    fontWeight: "900",
    fontSize: 18,
    marginVertical: 15,
  },
  datetamp: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
  },
  timestamp: {
    alignSelf: "flex-end",
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    marginLeft: 10,
  },
  readButton: {
    top: 0,
    right: 0,
    marginLeft: 50,
    padding: 1,
    borderRadius: 5,
    borderRadius: 20,
  },
  readButtonRead: {
    position: "absolute",
    top: 0,
    righ: 10,
    backgroundColor: "#003366",
    color:'white',
    paddingHorizontal: 15,
  },
  readButtonUnread: {
    position: "absoluteive",
    top: 0,
    righ: 10,
    paddingHorizontal: 10,
    backgroundColor: "#003366",
  },
  notificationcontainer: {
    top:10,
    bottom:15,
    paddingVertical: 10,
    paddingBottom:20,
    height: "87%",
    backgroundColor: "white",
    alignSelf: "center",
    borderRadius: 20,
    borderColor: "black",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
});
