import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { getAuth } from 'firebase/auth';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ReportView = () => {
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
    }
  }, []);

  const qrCodeValue = userId ? `user/${userId}/medicalRecords/` : null;

  useEffect(() => {
    if (qrCodeValue) {
      console.log('QR Code Value:', qrCodeValue);
    }
  }, [qrCodeValue]);

  return (

    <View style={styles.container}>
        <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Ionicons name="arrow-back-circle" size={40} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Labs Reports</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E4EC",
    padding: 15,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 20,
    marginLeft: 15,
    color: "#003366",
    flex: 1,
    fontWeight: "900",
  },
});

export default ReportView;
