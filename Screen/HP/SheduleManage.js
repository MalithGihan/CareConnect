import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getAllPatients, updateClinicDate } from '../../utils/actions/userActions';

export default function ScheduleManage() {
    const [patients, setPatients] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            const patientList = await getAllPatients();
            setPatients(patientList);
        };

        fetchPatients();
    }, []);

    const handleUpdateClinicDate = async () => {
        if (selectedPatientId) {
            await updateClinicDate(selectedPatientId, selectedDate);
            setSelectedDate(''); // Clear selected date after update
            setShowCalendar(false); // Close calendar
            // Optionally refetch patients or update state here
        }
    };

    const renderPatient = ({ item }) => (
        <View style={styles.patientItem}>
            <Text style={styles.patientName}>{item.name}</Text>
            <Text>{item.email}</Text>
            <Text>Clinic Dates: {item.clinicDates ? item.clinicDates.join(', ') : "No clinic dates set"}</Text>
            <Button
                title="Select Clinic Date"
                onPress={() => {
                    setShowCalendar(true);
                    setSelectedPatientId(item.id); // Set selected patient ID
                }}
            />
            <Button
                title="Update Clinic Date"
                onPress={handleUpdateClinicDate}
                disabled={!selectedDate} // Disable if no date is selected
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Schedule Management</Text>
            {showCalendar && (
                <Calendar
                    onDayPress={(day) => {
                        setSelectedDate(day.dateString);
                        setShowCalendar(false); // Close calendar on date select
                    }}
                    markingType={'simple'}
                    markedDates={{
                        [selectedDate]: { selected: true, marked: true },
                    }}
                />
            )}
            <FlatList
                data={patients}
                renderItem={renderPatient}
                keyExtractor={item => item.id}
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
    patientItem: {
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 10,
    },
    patientName: {
        fontSize: 18,
        fontWeight: '600',
    },
});
