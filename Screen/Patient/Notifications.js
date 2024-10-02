import { Text, View, FlatList, StyleSheet, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserNotifications, markNotificationAsRead } from '../../utils/actions/userActions';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

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
          notification.id === notificationId ? { ...notification, read: true } : notification
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
            <Entypo name="calendar" size={24} color="black" />
            <Text style={styles.datetamp}>
              {new Date(item.dateC).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Pressable onPress={() => handleMarkAsRead(item.id)}
              style={[ styles.readButton, item.read ? styles.readButtonRead : styles.readButtonUnread, ]}>
              <Text>{item.read ? "Read" : "Mark as Read"}</Text>
            </Pressable>
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text>Date: {item.date}</Text>
          <Text>Time: {item.Time}</Text>
          <Text>Venue: {item.venue}</Text>
          <Text>Doctor: {item.doctor}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.dateC).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true, 
            })}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.notificationItem}>
          <View style={styles.top}>
            <Entypo name="calendar" size={24} color="black" />
            <Text style={styles.datetamp}>
              {new Date(item.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Pressable onPress={() => handleMarkAsRead(item.id)}
              style={[ styles.readButton, item.read ? styles.readButtonRead : styles.readButtonUnread, ]}>
              <Text>{item.read ? "Read" : "Mark as Read"}</Text>
            </Pressable>
          </View>
          <Text style={styles.title}>
            <Text style={styles.symbol}>  !!  </Text>
            Clinic Appointment Cancelled
            <Text style={styles.symbol}>  !!  </Text>
          </Text>
          <Text>Cancelled Date: {item.clinicDate}</Text>
          <Text>Reason: {item.reason}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.date).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            })}
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons onPress={() => navigation.goBack()} name="arrow-back-ios-new" size={24} color="#003366" />
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <View style={styles.notificationcontainer} >
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text>No notifications available.</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9E4EC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    color: '#003366',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  notificationItem: {
    backgroundColor: 'white',
    margin: 15,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    borderRadius: 20,
    borderColor: 'black',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  symbol: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 10,
  },
  datetamp: {
    marginLeft: 20,
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  timestamp: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    marginLeft: 10
  },
  readButton: {

    position: 'relative',
    top: 0,
    right: 0,
    marginLeft: 50,
    padding: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
  },
  readButtonRead: {
    position: 'relative',
    top: 0,
    left: 30, 
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
  readButtonUnread: {
    position: 'relative',
    top: 0,
    left: -10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  notificationcontainer: {
    width: 380,
    paddingVertical: 10,
    margin: 20,
    height: '87%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 20,
    borderColor: 'black',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
});