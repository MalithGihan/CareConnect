import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native'; 
import { Calendar } from 'react-native-calendars';
import { updateClinicDate, fetchDoctors } from '../../utils/actions/userActions'; 
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker'; 


export default function ClinicDateSelection() {
    const [selectedDate, setSelectedDate] = useState('');
    const [doctor, setDoctor] = useState('');
    const [doctors, setDoctors] = useState([]); 
    const [venue, setVenue] = useState('');
    const [time, setTime] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);

    const navigation = useNavigation();
    const route = useRoute();
    const { selectedPatientIds } = route.params;

    
    useEffect(() => {
        const loadDoctors = async () => {
            const doctorsList = await fetchDoctors(); 
            setDoctors(doctorsList);
        };

        loadDoctors();
    }, []);

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

            <Text>Select Doctor:</Text>
            <Picker
                selectedValue={doctor}
                onValueChange={(itemValue) => setDoctor(itemValue)}
                style={styles.input}
            >
                <Picker.Item label="Select a doctor" value="" />
                {doctors.map((doc) => (
                    <Picker.Item key={doc.id} label={doc.name} value={doc.name} />
                ))}
            </Picker>

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
