import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function DashboardHP() {

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
      </View>

      
      <View style={styles.gridvertical} >
          <Pressable style={[styles.btn]} onPress={() => navigation.navigate("Clinic Shedule")}> 
          <Entypo name="newsletter" size={30} color="#00BFA5" />
            <Text style={styles.mainbtntext}>Add New News</Text>
          </Pressable>
          <Pressable style={[styles.btn]} onPress={() => navigation.navigate("UserCreate")}>
          <AntDesign name="adduser" size={30} color="#00BFA5" />
            <Text style={styles.mainbtntext}>User Register</Text>
          </Pressable>
          <Pressable style={[styles.btn]} onPress={() => navigation.navigate("Clinic")}>
          <MaterialIcons name="schedule" size={30} color="#00BFA5" />
            <Text style={styles.mainbtntext}>Schedule Management</Text>
          </Pressable>
          <Pressable style={[styles.btn]} onPress={() => navigation.navigate("QR Scanner")}>
          <Ionicons name="scan" size={30} color="#00BFA5" />
            <Text style={styles.mainbtntext}>Patient Medical Scan</Text>
          </Pressable>
          <Pressable style={[styles.btn]} onPress={() => navigation.navigate("Patient Report Manage")}>
          <Ionicons name="document-attach" size={30} color="#00BFA5" />
            <Text style={styles.mainbtntext}>Report Management</Text>
          </Pressable>
        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E4EC",
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#D9E4EC',
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '900',
    color: '#003366',
    marginBottom:20,
    marginTop: 10,
  },
  gridvertical: {
    alignSelf: 'center',
    width:'100%',
  },
  btn: {
    width:350,
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
  mainbtntext: {
    fontSize: 15,
    fontWeight: '900',
    color: '#003366',
  },

});