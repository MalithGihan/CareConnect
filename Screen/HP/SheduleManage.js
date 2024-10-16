import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  addNewsItem,
  fetchNewsFeed,
  updateNewsFeedItem,
  deleteNewsFeedItem,
} from "../../utils/actions/userActions"; 
import Ionicons from '@expo/vector-icons/Ionicons';
import CommonNavBtn from "../../Components/CommonNavBtn";

export default function ScheduleManage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [newsFeedItems, setNewsFeedItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const currentDate = new Date().toISOString();

  useEffect(() => {
    fetchAllNewsFeed();
  }, []);

  const fetchAllNewsFeed = async () => {
    try {
      const items = await fetchNewsFeed();
      setNewsFeedItems(items);
    } catch (error) {
      console.error("Error fetching news feed:", error);
      Alert.alert("Error", "Failed to fetch news feed items");
    }
  };

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access the gallery is required!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddOrUpdateNewsFeed = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Title and description are required");
      return;
    }

    try {
      if (editingItemId) {
        await updateNewsFeedItem(editingItemId, {
          title,
          description,
          imageUrl: imageUri,
        });
        Alert.alert("Success", "News feed updated successfully");
      } else {
        await addNewsItem(title, description, currentDate, imageUri);
        Alert.alert("Success", "News feed added successfully");
      }
      resetForm();
      fetchAllNewsFeed();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUri(null);
    setEditingItemId(null);
  };

  const handleEditNewsFeed = (item) => {
    setTitle(item.title);
    setDescription(item.description);
    setImageUri(item.imageUrl);
    setEditingItemId(item.id);
  };

  const handleDeleteNewsFeed = async (id) => {
    try {
      await deleteNewsFeedItem(id);
      Alert.alert("Success", "News feed deleted successfully");
      fetchAllNewsFeed();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage News Feed</Text>
      </View>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
      />

      <Text style={styles.label}>Image</Text>
      <TouchableOpacity  onPress={selectImage} style={styles.pickup}>
      <Ionicons name="images" size={40} color="#003366" />
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}


<CommonNavBtn
             onPress={handleAddOrUpdateNewsFeed}
              title={editingItemId ? "Update News Feed" : "Add News Feed"}
              style={{ backgroundColor: "#003366",marginBottom:20 }}
            />

    <Text style={[styles.label,{fontSize:20,fontWeight:'900'}]}>Previous Added</Text>

      <FlatList
        data={newsFeedItems}
        contentContainerStyle={{paddingBottom:100}}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.newsFeedItem}>
            <Text style={styles.newsFeedTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            )}
            <View style={styles.buttonContainer}>
              <Button title="Edit" onPress={() => handleEditNewsFeed(item)} color="#003366"/>
              <Button
                title="Delete"
                onPress={() => handleDeleteNewsFeed(item.id)}
                color="red"
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#D9E4EC",
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '900',
    color: '#003366',
    marginTop: 10,
    marginBottom:20
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#003366',
    marginBottom:10
  },
  input: {
    backgroundColor: "#FFF",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  textArea: {
    height: 200,
    textAlignVertical: "top",
  },
  pickup:{
    marginBottom:10
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  newsFeedItem: {
    marginHorizontal:5,
    padding: 15,
    gap:5,
    marginBottom:15,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  newsFeedTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap:10,
    marginTop: 10,
  },
});
