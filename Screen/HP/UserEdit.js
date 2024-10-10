import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { saveUser } from '../../utils/actions/userActions';

const UserEdit = () => {
    const route = useRoute();
    const { user } = route.params || {};
    const navigation = useNavigation();
    const [username, setuserName] = useState(user ? user.username : '');
    const [name, setName] = useState(user ? user.name : '');
    const [email, setEmail] = useState(user ? user.email : '');
    const [phoneNumber, setPhonenumber] = useState(user ? user.phoneNumber : '');
    const [address, setAddress] = useState(user ? user.address : '');
    const [dob, setdob] = useState(user ? user.dateOfBirth : '');

    const handleSave = async () => {
        try {
            await saveUser(user, username, email, phoneNumber, address);
            navigation.goBack();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    useEffect(() => {
        if (user) {
            console.log('Editing user:', user);
        }
    }, [user]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{user ? 'Edit User' : 'Create User'}</Text>
            <Text style={styles.label}>Username</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Username"
                value={username}
                onChangeText={setuserName}
            />
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Name"
                value={name}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Phone Number"
                value={phoneNumber}
                onChangeText={setPhonenumber}
                keyboardType="phone-pad"
            />
            <Text style={styles.label}>Address</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Address"
                value={address}
                onChangeText={setAddress}
            />
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Date of Birth"
                value={dob}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{user ? 'Update User' : 'Create User'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        color: '#555',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default UserEdit;
