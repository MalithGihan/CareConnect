import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import EmergencyPage from "../EmergencyPage";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function QucickTreatment() {
  const [currentPage, setCurrentPage] = useState(0);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          padding: 15,
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Dashbord")}>
          <Ionicons name="arrow-back-circle" size={40} color="#003366" />
        </TouchableOpacity>
        <Text
          style={{ fontSize: 20, marginLeft: 15, color: "#003366", flex: 1, fontWeight:'900' }}
          numberOfLines={1}
        >
          Quick Treatments
        </Text>
      </View>

      <EmergencyPage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E4EC",
  },
});
