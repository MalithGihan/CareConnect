import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ReportManage() {
    return (
        <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.titleText} numberOfLines={1}>
          Report Management
        </Text>
      </View>
    </View>
  )
}

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
      
});
