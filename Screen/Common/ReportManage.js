import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ReportManage() {
    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}  // Customize your colors
            style={styles.container}
        >
            <Text style={styles.text}>Report</Text>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 20,
    }
});
