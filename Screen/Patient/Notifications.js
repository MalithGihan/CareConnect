import { Text, View, FlatList, StyleSheet, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserNotifications, markNotificationAsRead } from '../../utils/actions/userActions';

export default function Notifications() {
  const userData = useSelector((state) => state.auth.userData);
  const [notifications, setNotifications] = useState([]);

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
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>Date: {item.date}</Text>
      <Text>Time: {item.Time}</Text>
      <Text>Venue: {item.venue}</Text>
      <Text>Doctor: {item.doctor}</Text>
      <Pressable onPress={() => handleMarkAsRead(item.id)} style={styles.readButton}>
        <Text>{item.read ? "Read" : "Mark as Read"}</Text>
      </Pressable>
      <Text style={styles.timestamp}>{new Date(item.date).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No notifications available.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notificationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  readButton: {
    marginTop: 10,
    padding: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    alignItems: 'center',
  },
});