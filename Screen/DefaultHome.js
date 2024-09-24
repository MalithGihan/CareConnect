import { StyleSheet, Text, Dimensions, Image, View, Alert, ScrollView } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import CommonNavBtn from "../Components/CommonNavBtn";
import EmergencyPage from "./EmergencyPage";


export default function DefaultHome() {
  const [currentPage, setCurrentPage] = useState(0);
  const navigation = useNavigation();

  const clearOnboarding = async () => {
    try {
      await AsyncStorage.removeItem("@viewedOnboarding");
      Alert.alert(
        "Onboarding cleared",
        "You will see the onboarding screens again when you restart the app."
      );
    } catch (err) {
      console.log("Error @clearOnboarding", err);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.topic}>
        <View style={styles.leftCorner}>
          <Text style={{ fontSize: 35, marginBottom: 5 }}>Welcome</Text>
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>to</Text>
          <Text style={styles.text}>CareConnect</Text>
        </View>

        <View style={styles.rightCorner}>
          <CommonNavBtn 
            onPress={() => navigation.navigate("Sign In")}
            title='Sign In'
            style={{ marginVertical: 8 }}
          />
        </View>
      </View>

      <EmergencyPage />


      <View style={styles.centeredButton}>
        <CommonNavBtn 
          title='Clear Onboarding'
          onPress={clearOnboarding}
          style={{ marginVertical: 8 ,backgroundColor:'white'}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  leftCorner: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 1,
  },
  rightCorner: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  topic: {
    height: '20%',
    marginBottom: 20,
  },
  centeredButton: {
    flex: 1,
    bottom: 30,
    left: 10,
    position: 'absolute',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
  }
});
