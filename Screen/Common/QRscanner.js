import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

export default QRscanner = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.titleText} numberOfLines={1}>
          QR Scanner
        </Text>
      </View>

      <TouchableOpacity style={styles.btn}>
        <AntDesign name="camera" size={40} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#D9E4EC",
    width: "100%",
    padding: 15,
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginBottom: 25,
  },
  titleText: {
    fontSize: 25,
    marginTop: 10,
    color: "#003366",
    flex: 1,
    fontWeight: "900",
  },
  btn: {
    position:'absolute',
    bottom:100,
    alignSelf:'center',
    width: 80,
    height: 80,
    backgroundColor: "#003366",
    borderRadius: 60,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    justifyContent: "center", // Center vertically
    alignItems: "center",
  },
});
