import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { updateClinicDate } from '../../utils/actions/userActions';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ClinicDateSelection() {
    const [selectedDate, setSelectedDate] = useState('');
    const [doctor, setDoctor] = useState('');
    const [venue, setVenue] = useState('');
    const [time, setTime] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);

    const navigation = useNavigation();
    const route = useRoute();
    const { selectedPatientIds } = route.params;

    const handleUpdateClinicDate = async () => {
        if (selectedDate && doctor && venue && time) {
            for (let id of selectedPatientIds) {
                await updateClinicDate(id, selectedDate, doctor, venue, time);
            }
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Clinic Date Selection</Text>
            <Text>Selected Patients: {selectedPatientIds.length}</Text>
            
            <Button
                title="Select Date"
                onPress={() => setShowCalendar(true)}
            />
            {showCalendar && (
                <Calendar
                    onDayPress={(day) => {
                        setSelectedDate(day.dateString);
                        setShowCalendar(false);
                    }}
                    markingType={'simple'}
                    markedDates={{
                        [selectedDate]: { selected: true, marked: true },
                    }}
                />
            )}
            <Text>Selected Date: {selectedDate}</Text>

            <TextInput
                style={styles.input}
                placeholder="Doctor"
                value={doctor}
                onChangeText={setDoctor}
            />
            <TextInput
                style={styles.input}
                placeholder="Venue"
                value={venue}
                onChangeText={setVenue}
            />
            <TextInput
                style={styles.input}
                placeholder="Time"
                value={time}
                onChangeText={setTime}
            />

            <Button
                title="Update Clinic Date for Selected Patients"
                onPress={handleUpdateClinicDate}
                disabled={!selectedDate || !doctor || !venue || !time}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});