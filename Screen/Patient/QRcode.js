import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { getAuth } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const QRcode = ({ route }) => {
  const [userId, setUserId] = useState(null);
  const { medicalReports } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
    }
  }, []);

  const qrCodeValue = userId
    ? `user/${userId}/medicalRecords/${JSON.stringify(medicalReports)}`
    : null;

  useEffect(() => {
    if (qrCodeValue) {
      console.log("QR Code Value:", qrCodeValue);
    }
  }, [qrCodeValue]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Medical History")}
        >
          <Ionicons name="arrow-back-circle" size={40} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your QR Code</Text>
      </View>

      {qrCodeValue && (
        <View style={styles.qrCodeContainer}>
          <Text style={styles.qrCodeText}>Scan me</Text>
          <QRCode value={qrCodeValue} size={150} />
          <Text
            style={{
              fontSize: 14,
              textAlign: "center",
              marginVertical: 20,
              marginTop: 50,
            }}
          >
            Scan this QR code at your next clinic visit to quickly access your
            medical records.
          </Text>
          <Text
            style={{ fontSize: 12, textAlign: "center", marginVertical: 20 }}
          >
            You can also share this QR code with your healthcare provider for
            seamless access to your medical information.
          </Text>
        </View>
      )}
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
  qrCodeContainer: {
    margin: 5,
    margin: 50,
    padding: 15,
    paddingVertical: 25,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    alignItems: "center",
  },
  qrCodeText: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 30,
  },
});

export default QRcode;
