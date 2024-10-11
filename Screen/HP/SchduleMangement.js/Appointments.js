import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import GetPatients from './GetPatients'

export default function Appointments() {
  return (
    <View style={styles.container}>
      <GetPatients />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E4EC",
    padding: 15,
  }
})