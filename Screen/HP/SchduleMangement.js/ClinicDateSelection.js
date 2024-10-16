import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TextInput,
} from "react-native";
import { Calendar } from "react-native-calendars";
import {
  AddClinicDate,
  fetchDoctors,
  getDateSlots,
  blockTimeSlot,
  sendUserNotification,
} from "../../../utils/actions/userActions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";

export default function ClinicDateSelection() {
  const [selectedDate, setSelectedDate] = useState("");
  const [doctor, setDoctor] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [venue, setVenue] = useState("");
  const [time, setTime] = useState("");
  const [secondPatientTime, setSecondPatientTime] = useState("");
  const [markedDates, setMarkedDates] = useState({});
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedPatientIds } = route.params;
  const [dateSlots, setDateSlots] = useState({});
  const [loading, setLoading] = useState(false);
  const [patientTimes, setPatientTimes] = useState([]);

  useEffect(() => {
    const loadDoctors = async () => {
      const doctorsList = await fetchDoctors();
      setDoctors(doctorsList);
    };

    const fetchDateSlots = async () => {
      try {
        const slots = await getDateSlots();
        console.log("Fetched date slots:", slots);
        setDateSlots(slots);
        updateMarkedDates(slots);
      } catch (err) {
        console.error("Error fetching date slots:", err);
      }
    };

    loadDoctors();
    fetchDateSlots();
  }, []);

  const updateMarkedDates = (slots) => {
    const newMarkedDates = {};
    Object.keys(slots).forEach((date) => {
      newMarkedDates[date] = { marked: true, dotColor: "#00adf5" };
    });
    setMarkedDates(newMarkedDates);
  };

  const fetchAvailableTimeSlots = (dateSlots, selectedDate) => {
    if (dateSlots[selectedDate] && dateSlots[selectedDate].timeslots) {
      return dateSlots[selectedDate].timeslots.timeslots.filter(
        (slot) => !slot.booked
      );
    }
    return [];
  };

  const onDayPress = (day) => {
    const newSelectedDate = day.dateString;
    if (
      !dateSlots[newSelectedDate] ||
      !dateSlots[newSelectedDate].timeslots ||
      dateSlots[newSelectedDate].timeslots.timeslots.every(
        (slot) => slot.booked
      )
    ) {
      Toast.show({
        type: "error",
        text1: "Date Not Available",
        text2: "Please select a date with available time slots.",
      });
      return;
    }

    setSelectedDate(newSelectedDate);
    setTime("");
    setPatientTimes([]);

    const slots = fetchAvailableTimeSlots(dateSlots, newSelectedDate);
    setAvailableTimeSlots(slots);
    console.log("Available Time Slots for selected date:", slots);

    const updatedMarkedDates = { ...markedDates };
    Object.keys(updatedMarkedDates).forEach((date) => {
      updatedMarkedDates[date].selected = false;
      delete updatedMarkedDates[date].selectedColor;
    });
    updatedMarkedDates[newSelectedDate] = {
      selected: true,
      selectedColor: "#4CAF50",
    };
    setMarkedDates(updatedMarkedDates);
  };

  const handleTimeChange = (selectedTime) => {
    setTime(selectedTime);
    const currentSlotIndex = availableTimeSlots.findIndex(
      (slot) => slot.time === selectedTime
    );
    if (
      currentSlotIndex !== -1 &&
      currentSlotIndex < availableTimeSlots.length - 1
    ) {
      const updatedTimes = selectedPatientIds.map((_, index) => {
        if (index === 0) {
          return selectedTime;
        }
        const nextSlot = availableTimeSlots[currentSlotIndex + index];
        return nextSlot ? nextSlot.time : "";
      });
      setPatientTimes(updatedTimes);
      setSecondPatientTime(updatedTimes[1]);
    } else {
      setSecondPatientTime("");
    }
  };

  const handleAddClinicDate = async () => {
    if (selectedDate && doctor && venue && time) {
      try {
        setLoading(true);
        const promises = selectedPatientIds.map((id, index) => {
          const appointmentTime = index === 0 ? time : patientTimes[index];
          return AddClinicDate(
            id,
            selectedDate,
            doctor.id,
            doctor.name,
            venue,
            appointmentTime
          );
        });
        await Promise.all(promises);
        await blockTimeSlot(selectedDate, time);
        if (secondPatientTime) {
          await blockTimeSlot(selectedDate, secondPatientTime);
        }
        const notificationPromises = selectedPatientIds.map((id, index) => {
          const appointmentTime = index === 0 ? time : patientTimes[index];
          const notification = {
            title: "Your Clinic Appointment has been Scheduled.",
            date: `${selectedDate}`,
            Time: `${appointmentTime}`,
            venue: `${venue}`,
            doctor: `Dr. ${doctor.fullName}`,
            dateC: new Date().toISOString(),
            read: false,
          };
          return sendUserNotification(id, notification);
        });
        await Promise.all(notificationPromises);

        const updatedSlots = {
          ...dateSlots,
          [selectedDate]: {
            ...dateSlots[selectedDate],
            timeslots: {
              ...dateSlots[selectedDate].timeslots,
              timeslots: dateSlots[selectedDate].timeslots.timeslots.map(
                (slot) =>
                  slot.time === time || patientTimes.includes(slot.time)
                    ? { ...slot, booked: true }
                    : slot
              ),
            },
          },
        };
        setDateSlots(updatedSlots);
        updateMarkedDates(updatedSlots);

        Toast.show({
          type: "success",
          text1: "Success",
          text2:
            "Clinic dates and notifications updated for selected patients.",
        });
        navigation.goBack();
      } catch (error) {
        console.error("Error updating clinic date:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to update clinic dates. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields.",
      });
    }
  };

  return (
<View style={styles.container}>
  
<View style={styles.header}>
        <Text style={styles.headerTitle}>Clinic Date Selection</Text>
      </View>

    <Calendar
      onDayPress={onDayPress}
      markingType={"simple"}
      markedDates={{
        ...markedDates,
        [selectedDate]: {
          selected: true,
          marked: true,
          selectedColor: "#4CAF50",
        },
      }}
      style={styles.calendar}
    />

<ScrollView style={styles.scrollContainer} nestedScrollEnabled={true}>

    <Text style={{ fontSize: 15, marginBottom: 5, fontWeight: "900", color: "#003366" }}>
      Select Doctor:
    </Text>
    <Picker
      selectedValue={doctor}
      onValueChange={(itemValue) => setDoctor(itemValue)}
      style={styles.input}
    >
      <Picker.Item label="Select a doctor" value="" />
      {doctors.map((doc) => (
        <Picker.Item key={doc.id} label={doc.name} value={doc} />
      ))}
    </Picker>

    <TextInput
      style={styles.input}
      placeholder="Venue"
      value={venue}
      onChangeText={setVenue}
    />

    <Text style={{ fontSize: 15, marginBottom: 5, fontWeight: "900", color: "#003366" }}>
      Select Time Slot:
    </Text>
    <Picker
      selectedValue={time}
      onValueChange={handleTimeChange}
      style={styles.input}
      enabled={availableTimeSlots.length > 0}
    >
      <Picker.Item label="Select a time slot" value="" />
      {availableTimeSlots.length > 0 ? (
        availableTimeSlots.map((slot, index) => (
          <Picker.Item key={index} label={slot.time} value={slot.time} />
        ))
      ) : (
        <Picker.Item label="No available slots" value="" enabled={false} />
      )}
    </Picker>

    <Text style={{ fontSize: 15, marginBottom: 5, fontWeight: "900", color: "#003366" }}>
      Patient Time Slots:
    </Text>
    {patientTimes.map((time, index) => (
      <Text key={index}>
        Patient {index + 1}: {time}
      </Text>
    ))}

    <Button
      title={loading ? "Updating..." : "Add Clinic Dates"}
      onPress={handleAddClinicDate}
      disabled={!selectedDate || !doctor || !venue || !time || loading}
      style={styles.btn}
    />

    <Toast />
  </ScrollView>
</View>

  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#D9E4EC",
      padding: 15,
    },
    header: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      backgroundColor: "#D9E4EC",
    },
    headerTitle: {
      fontSize: 25,
      fontWeight: "900",
      color: "#003366",
     
    },
    scrollContainer: {
      flexGrow: 1, 
      paddingBottom: 100, 
      marginBottom:100
    },
    input: {
      marginVertical: 8,
      backgroundColor: "white",
      borderRadius: 5,
      padding: 10,
    },
    calendar: {
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
      marginTop: 10,
      marginBottom: 20 
    },
    btn: {
     paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderRadius:20
    },
  });
  