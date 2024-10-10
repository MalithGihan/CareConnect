import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { getAuth } from 'firebase/auth';
import { Calendar } from 'react-native-calendars';
import { fetchClinicDatestoDoc, handleDatePress } from '../../utils/actions/userActions';

const DashboardDoctor = () => {
  const [clinicDates, setClinicDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [appointments, setAppointments] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userId = currentUser ? currentUser.uid : null;

  useEffect(() => {
    const loadClinicDates = async () => {
      if (userId) {
        const dates = await fetchClinicDatestoDoc(userId);
        setClinicDates(dates);
      }
    };
    loadClinicDates();
  }, [userId]);

  const onDayPress = async (day) => {
    setSelectedDate(day.dateString);
    if (userId) {
      await handleDatePress(userId, day, setAppointments);
    }
  };

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const dayWithSuffix = day + getDaySuffix(day);
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${dayWithSuffix} of ${month}, ${year}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.titleText} numberOfLines={1}>
          Appointments
        </Text>
      </View>

      <Calendar
        markedDates={clinicDates}
        markingType={'dot'}
        onDayPress={onDayPress}
        style={styles.calendarStyle}
      />
      {selectedDate && (
        <View style={styles.appointmentList}>
          <Text style={styles.sectionTitle}>{formatDate(selectedDate)}</Text>
          {appointments.length > 0 ? (
            <FlatList
              data={appointments}
              renderItem={({ item }) => (
                <View style={styles.appointmentItem}>
                  <Text style={[styles.appointmentText,{fontSize:15,fontWeight:"600"}]}>Patient's Name: {item.name}</Text>
                  <Text style={[styles.appointmentText,{fontSize:15,fontWeight:"900"}]}>Time: {item.time}</Text>
                  <Text style={[styles.appointmentText,{fontSize:15,fontWeight:"900"}]}>Venue: {item.venue}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <Text>No appointments scheduled for this date.</Text>
          )}
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
    width: "100%",
    alignItems: "center",
    marginBottom: 25,
  },
  titleText: {
    fontSize: 20,
    marginTop: 10,
    color: "#003366",
    flex: 1,
    fontWeight: "900",
  },
  calendarStyle: {
    alignSelf: "center",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "white",
    width: "95%",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: 10, 
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginVertical:15,
    marginHorizontal:5,
    color: "#003366",
  },
  appointmentList: {
    marginVertical: 20,
  },
  appointmentItem: {
    marginHorizontal:5,
    marginVertical:10,
    padding: 15,
    gap:5,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  appointmentText: {
    color: "#003366",
  },
});

export default DashboardDoctor;
