import { StyleSheet, Text, View, FlatList, Image, Alert, Dimensions, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { fetchNewsFeed } from "../../utils/actions/userActions";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function DashboardPatient() {
  const [newsFeedItems, setNewsFeedItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchAllNewsFeed();
  }, []);

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

  const renderFeaturedItem = ({ item }) => (
    <View style={styles.featuredItem}>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.featuredImage} />}
      <Text style={styles.featuredTitle}>{item.title}</Text>
      <Text style={styles.featuredTitle1}>{item.description}</Text>
    </View>
  );

  const handleScroll = (event) => {
    const index = Math.floor(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medical News</Text>
      </View>
      <ScrollView>
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
        <View style={styles.gridhorizonatle}>
          <Pressable style={[styles.mainbtn, { width: '30%' },]}>
            <MaterialCommunityIcons name="face-man" size={24} color="#00BFA5" />
            <Text style={styles.mainbtntext}>Profile</Text>
          </Pressable>
          <Pressable style={[styles.mainbtn, { width: '50%' },]}>
            <FontAwesome5 name="book-medical" size={24} color="#00BFA5" />
            <Text style={styles.mainbtntext}>Quick Treatment</Text>
          </Pressable>
        </View>

        <Text style={styles.mainbtntext}>Quick Treatment</Text>
        <View style={styles.gridvertical} >
          <Pressable style={[styles.btn, { width: '50%' },]}>
            <FontAwesome5 name="book-medical" size={24} color="#00BFA5" />
            <Text style={styles.mainbtntext}>Quick Treatment</Text>
          </Pressable>
          <Pressable style={[styles.btn, { width: '50%' },]}>
            <FontAwesome5 name="book-medical" size={24} color="#00BFA5" />
            <Text style={styles.mainbtntext}>Quick Treatment</Text>
          </Pressable>
          <Pressable style={[styles.btn, { width: '50%' },]}>
            <FontAwesome5 name="book-medical" size={24} color="#00BFA5" />
            <Text style={styles.mainbtntext}>Quick Treatment</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  featuredList: {
    alignSelf: 'center',
    width: '95%',
    padding: 20,
    marginBottom: 20,
  },
  featuredItem: {
    width: width * 1,
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  featuredTitle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuredTitle1: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  newsFeedItem: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  newsFeedTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
  },
  activeDot: {
    backgroundColor: '#007AFF',
  },
  inactiveDot: {
    backgroundColor: '#C4C4C4',
  },
  noNewsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
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
    marginTop: 10,
    alignItems: 'center',
    padding: 20,
    height: 150,
    borderRadius: 20,
    justifyContent: 'space-evenly',
    borderColor: 'black',
    borderWidth: 1
  },
  mainbtntext: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
  },
  btn: {
    margin: 15,
    alignItems: 'center',
    paddingVertical: 20,
    width: 380,
    borderRadius: 20,
    justifyContent: 'space-evenly',
    borderColor: 'black',
    borderWidth: 1,
    alignSelf: 'center',
  },
  gridvertical: {
    marginTop: 10,
    width: '90%',
    alignSelf: 'center',
  }

});
