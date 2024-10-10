import React, { useState, useEffect } from 'react';
import { Text, View, Button, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getUsersByRole } from '../../utils/actions/userActions';
import { Ionicons } from '@expo/vector-icons';

const RoleBasedUsers = () => {
    const [roleFilter, setRoleFilter] = useState('patient');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const fetchUsers = async (role) => {
        setLoading(true);
        try {
            const users = await getUsersByRole(role);
            setFilteredUsers(users);
        } catch (error) {
            console.error(`Error fetching users for role ${role}:`, error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (roleFilter && isFocused) {
            fetchUsers(roleFilter);
        }
    }, [roleFilter, isFocused]);

    const handleEditPress = (user) => {
        navigation.navigate('UserEdit', { user });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Role-Based Users</Text>
            <View style={styles.buttonContainer}>
                <Button title="Patient" onPress={() => setRoleFilter('patient')} />
                <Button title="Doctor" onPress={() => setRoleFilter('doctor')} />
                <Button title="Health Provider" onPress={() => setRoleFilter('healthProvider')} />
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.userItem}>
                            <View style={styles.userInfo}>
                                <Text>Username : {item.username}</Text>
                                <Text>Role : <Text>{item.role.charAt(0).toUpperCase() + item.role.slice(1)}</Text>
                                </Text>
                                <Text>Email: {item.email}</Text>
                                
                            </View>

                            <TouchableOpacity onPress={() => handleEditPress(item)}>
                                <Ionicons name="pencil" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={<Text>No users found for this role.</Text>}
                />
            )}

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => navigation.navigate('UserCreate')}
            >
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    userItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    userInfo: {
        flex: 1,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#2196F3',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
});

export default RoleBasedUsers;
