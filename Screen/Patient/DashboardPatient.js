import { StyleSheet, Text, View, FlatList, Image, Alert, Dimensions, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { fetchNewsFeed, getUserNotifications } from "../../utils/actions/userActions";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';



export default function DashboardPatient() {
  const [newsFeedItems, setNewsFeedItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const userData = useSelector((state) => state.auth.userData);
  const navigation = useNavigation();

  useEffect(() => {
    fetchAllNewsFeed();
    fetchUserNotifications(userData.userId);
  }, [userData]);

  useFocusEffect(
    React.useCallback(() => {
      if (userData && userData.userId) {
        fetchUserNotifications(userData.userId);
      }
    }, [userData])
  );

  const fetchAllNewsFeed = async () => {
    try {
      const items = await fetchNewsFeed();
      setNewsFeedItems(items);
      setFeaturedItems(items.slice(0, 5));
    } catch (error) {
      console.error('Error fetching news feed:', error);
      Alert.alert('Error', 'Failed to fetch news feed items');
    }
  };
  const fetchUserNotifications = async (userId) => {
    try {
      const notifications = await getUserNotifications(userId);
      const unreadNotifications = notifications.filter(notification => !notification.read);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error("Error fetching user notifications:", error);
      Alert.alert("Error", "Failed to fetch notifications. Please try again.");
    }
  };

  const renderFeaturedItem = ({ item }) => (
    <View style={styles.featuredItem}>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.featuredImage} />}
      <View style={{flexDirection:'col'}}>
      <Text style={styles.featuredTitle}>{item.title}</Text>
      <Text style={styles.featuredTitle1}>{item.description}</Text>
      </View>
    </View>
  );

  const handleScroll = (event) => {
    const index = Math.floor(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>News Feed</Text>
        <Pressable onPress={() => navigation.navigate("notifications")} style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={24} color="black" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </Pressable>
      </View>
      
        <View>
          {featuredItems.length > 0 ? (
            <>
              <FlatList
                horizontal
                data={featuredItems}
                keyExtractor={(item) => `featured-${item.id.toString()}`}
                renderItem={renderFeaturedItem}
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={30}
                style={styles.featuredList}
              />
              <View style={styles.dotContainer}>
                {featuredItems.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      activeIndex === index ? styles.activeDot : styles.inactiveDot,
                    ]}
                  />
                ))}
              </View>
            </>
          ) : (
            <Text style={styles.noNewsText}>No news feeds available at the moment.</Text>
          )}
        </View>
        <ScrollView style={{marginBottom:100}}>
        <View style={styles.gridhorizonatle}>
          <Pressable style={[styles.mainbtn, { width: '35%' },]} onPress={() => navigation.navigate("User Profile")}>
          <FontAwesome5 name="hospital-user" size={50} color="#00BFA5" />
            <Text style={styles.mainbtntext}>Profile</Text>
          </Pressable>
          <Pressable style={[styles.mainbtn, { width: '50%' },]} onPress={() => navigation.navigate("QucickTreatment")}>
          <FontAwesome6 name="briefcase-medical" size={50} color="#00BFA5" />
            <Text style={styles.mainbtntext}>Quick Treatment</Text>
          </Pressable>
        </View>

        <Text style={[styles.mainbtntext,{marginLeft:15,marginVertical:15,fontSize:18}]}>Quick Treatment</Text>

        <View style={styles.gridvertical} >
          <Pressable style={[styles.btn]} onPress={() => navigation.navigate("Medical History")}> 
          <FontAwesome5 name="notes-medical" size={30} color="#00BFA5" />
            <Text style={styles.mainbtntext}>Medical History</Text>
          </Pressable>
          <Pressable style={[styles.btn]} onPress={() => navigation.navigate("Clinic Shedules")}>
          <FontAwesome5 name="history" size={30} color="#00BFA5" />
            <Text style={styles.mainbtntext}>Clinic Schedule</Text>
          </Pressable>
          <Pressable style={[styles.btn]} onPress={() => navigation.navigate("Reports")}>
          <FontAwesome5 name="file-medical-alt" size={30} color="#00BFA5" />
            <Text style={styles.mainbtntext}>Lab Reports</Text>
          </Pressable>
          <Pressable style={[styles.btn]} onPress={() => navigation.navigate("")}>
          <MaterialCommunityIcons name="car-emergency" size={30} color="#00BFA5" />
            <Text style={styles.mainbtntext}>Emeargancy Pickup</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9E4EC',
    paddingHorizontal:15
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#003366',
  },
  featuredList: {
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 5,
    paddingVertical:10,
    marginBottom: 5,
  },
  featuredItem: {
    width: width * 0.8,
    height:200,
    flexDirection:'col',
    justifyContent: 'space-around',
    marginHorizontal: 5,
    marginVertical:10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor:'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  featuredImage: {
    width: '100%',
    resizeMode: 'cover',
  },
  featuredTitle: {
    margin:10,
    color: 'black',
    fontSize: 18,
    fontWeight: '900',
  },
  featuredTitle1: {
    margin:10,
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    margin: 4,
  },
  activeDot: {
    backgroundColor: '#00BFA5',
  },
  inactiveDot: {
    backgroundColor: '#000000',
  },
  noNewsText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#000',
    marginTop: 20,
  },
  gridhorizonatle: {
    alignSelf: 'center',
    width: '100%',
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: 'center',
  },
  mainbtn: {
    marginVertical: 10,
    marginHorizontal:15,
    alignItems: 'center',
    padding: 20,
    height: 200,
    borderRadius: 15,
    justifyContent: 'space-evenly',
    backgroundColor:'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  mainbtntext: {
    fontSize: 15,
    fontWeight: '900',
    color: '#003366',
  },
  btn: {
    marginHorizontal: 15,
    marginVertical:10,
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 15,
    justifyContent: 'space-evenly',
    backgroundColor:'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    gap: 8
  },
  gridvertical: {
    alignSelf: 'center',
    width:'100%'
  },
  notificationIcon: {
    position: 'relative',
    padding: 5,
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#FF4136',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'center',
  }

});
