import { StyleSheet, Text, Dimensions, View, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import CommonNavBtn from "../Components/CommonNavBtn";
import EmergencyPage from "./EmergencyPage";
import { color } from "react-native-elements/dist/helpers";


export default function DefaultHome() {
  const [currentPage, setCurrentPage] = useState(0);
  const navigation = useNavigation();

  const { width } = Dimensions.get("window");
  const isPhone = width < 768;

  useEffect(() => {
    const delayRedirect = setTimeout(() => {
      if (isPhone) {
        navigation.navigate("Sign In");
      } else {
        navigation.navigate("Signin Admin");
      }
    }, 2000); 
    return () => clearTimeout(delayRedirect);
  }, [isPhone, navigation]);

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

  const handleSignInPress = () => {
    if (isPhone) {
      navigation.navigate("Sign In");
    } else {
      navigation.navigate("Signin Admin");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topic}>
        <View style={styles.leftCorner}>
          <Text style={{ fontSize: 25, fontWeight:'400', marginBottom: 5, color:'#003366' }}>Welcome</Text>
          <Text style={{ fontSize: 25,fontWeight:'400', color:'#003366'  }}>to</Text>
          <Text style={[styles.text,{color:'#003366'}]}>CareConnect</Text>
        </View>

        <View style={styles.rightCorner}>
          <CommonNavBtn
            onPress={handleSignInPress}
            title='Sign In'
            style={{ marginVertical: 8,backgroundColor:'#003366'}}
          />
        </View>
      </View>

      {isPhone && <EmergencyPage />}


      <View style={styles.centeredButton}>
        <CommonNavBtn
          title='Clear Onboarding'
          onPress={clearOnboarding}
          style={{ marginHorizontal: 5 , backgroundColor:'#003366'}}

        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
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
    alignItems: 'baseline'
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
  }
});
