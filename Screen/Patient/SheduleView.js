import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSelector } from 'react-redux';
import { getUserClinicDates } from '../../utils/actions/userActions';

export default function ScheduleView() {
  const [markedDates, setMarkedDates] = useState({});
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (userData && userData.userId) {
      fetchAndDisplayClinicDates(userData.userId);
    }
  }, [userData]);

  const fetchAndDisplayClinicDates = async (userId) => {
    try {
      const clinicDates = await getUserClinicDates(userId);
      const markedDatesObj = clinicDates.reduce((acc, date) => {
        acc[date] = { selected: true, marked: true, selectedColor: 'blue' };
        return acc;
      }, {});
      setMarkedDates(markedDatesObj);
    } catch (error) {
      console.error("Error fetching and displaying clinic dates:", error);
    }
  };

  if (!userData || !userData.userId) {
    return <Text>Loading user data...</Text>;
  }

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
       
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});